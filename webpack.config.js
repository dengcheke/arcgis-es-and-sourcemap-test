const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const DefinePlugin = require("webpack").DefinePlugin;

const isDev = process.env.NODE_ENV === "development";
const config = require("./config.js");
const defineOpts = Object.keys(config).reduce((res, key) => {
	res[`__CONFIG__.${key}`] = JSON.stringify(config[key]);
	return res;
}, {});
console.log(defineOpts);

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		main: path.resolve(__dirname, "./src/main.ts"),
	},
	output: {
		filename: "js/[name].[contenthash:5].js",
		chunkFilename: "js/[name].[contenthash:5].js",
		path: path.resolve(__dirname, "dist"),
		publicPath: "/",
	},
	resolve: {
		alias: {
			esri: path.resolve(__dirname, "./node_modules/@arcgis/core"),
		},
		extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.(j|t)sx?$/,
				include: [path.resolve("./src")],
				use: [
					{
						loader: "ts-loader",
						options: {
							transpileOnly: !isDev,
							context: __dirname,
							configFile: path.resolve(
								__dirname,
								"./tsconfig.json"
							),
						},
					},
				],
			},
			{
				test: /\.(le|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
			},
		],
	},
	devtool: isDev ? "eval-source-map" : "hidden-source-map",
	devServer: {
		contentBase: path.join(__dirname, "./public"),
		port: 10086,
	},
	optimization: {
		/* minimize:false,
		moduleIds:'named',
		chunkIds:'named', */
		splitChunks: {
			chunks: "all",
			minSize: 0,
			minChunks: 1,
			maxAsyncRequests: 6,
			maxInitialRequests: 6,
			cacheGroups: {
				defaultVendors: {
					test: /[\\/]node_modules[\\/]/,
					minChunks: 1,
					priority: -10,
					reuseExistingChunk: true,
				},
				default: {
					minChunks: 1,
					priority: -20,
					reuseExistingChunk: true,
				},
			},
		},
	},
	plugins: [
		new HtmlWebPackPlugin({
			title: "ArcGIS API  for JavaScript",
			template: "./public/index.temp.html",
			filename: "./index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash:5].css",
			chunkFilename: "css/[name].[contenthash:5].css",
		}),
		new DefinePlugin(defineOpts),
		isDev
			? null
			: new CopyWebpackPlugin({
					patterns: [
						{
							from: path.resolve(
								__dirname,
								"./node_modules/@arcgis/core/assets"
							),
							to: path.resolve(
								__dirname,
								`./dist${config.ARCGIS_ASSETS_PATH}`
							),
							toType: "dir",
							noErrorOnMissing: true,
						},
						{
							from: path.resolve(__dirname, "./public"),
							to: path.resolve(__dirname, "./dist"),
							toType: "dir",
							noErrorOnMissing: true,
							globOptions: {
								ignore: [
									"**/arcgis/**/*",
									"**/*.temp.*",
								],
							},
						},
					],
			  }),
		isDev
			? null
			: new BundleAnalyzerPlugin({
					analyzerMode: "static",
			  }),
	].filter(Boolean),
};
