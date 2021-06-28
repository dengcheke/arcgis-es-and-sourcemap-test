const fs = require("fs");
const path = require("path");
const { SourceMapConsumer } = require("source-map");
const http = require("http");
const bodyParser = require("body-parser");
const cache = new Map();
const parser = bodyParser.json();

const ParseBody = req => {
	return new Promise(res => {
		parser(req, null, (...args) => {
			res(...args);
		});
	});
};

const SourceMapParseCache = new Map();
const getSourceMapParser = async u => {
	const url = new URL(u);
	const match = (url.pathname || "").match(/\/([^\/]*js)$/);
	const filename = match ? match[1] : null;
	if (!filename) return;
	//get from cache
	let parser = SourceMapParseCache.get(filename);
	if (!parser) {
		const data = await getSourceMapData(filename);
		if (!data) return;
		parser = await new SourceMapConsumer(data);
		parser && SourceMapParseCache.set(filename, parser);
	}
	return parser;
	async function getSourceMapData(filename) {
		const data = await readFile(
			path.resolve(__dirname, `./dist/js/${filename}.map`)
		);
		return JSON.parse(data);
	}
};
async function readFile(pathname, options = "utf-8") {
	return new Promise((res, rej) => {
		fs.readFile(pathname, options, (err, data) => {
			if (err === null || err === undefined) {
				res(data);
			} else {
				rej(err);
			}
		});
	});
}
async function reportError(body) {
	if (!body) return;
	const { message, source, lineno, colno, error } = body;
	const parser = await getSourceMapParser(source);
	if (!parser) return;
	const pos = parser.originalPositionFor({
		line: lineno,
		column: colno,
	});
	if (pos) {
		console.log(`-------------------`);
		console.log({
			...pos,
			message: message,
		});
	}
}


const server = http.createServer(async (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-type,Content-Length,Authorization,Accept,X-Requested-Width"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"PUT,POST,GET,DELETE,OPTIONS"
	);
	if (req.method.toLowerCase() === "options") {
		return res.end();
	}
	if (req.method.toLowerCase() === "post") {
		try {
			ParseBody(req).then(() => {
				reportError(req.body);
			});
		} catch (e) {
			console.log(e);
		}
	}
	res.end();
});
console.log("listen:10096");
server.listen("10096");