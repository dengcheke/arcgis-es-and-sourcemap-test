import MapView from "esri/views/MapView";
import EsriMap from "esri/Map";
import esriConfig from "esri/config";
import "./assets/style.less";
import { HelloWorld } from "./widget/HelloWorld";
import { __CONFIG__ } from "./config";

esriConfig.assetsPath = __CONFIG__.ARCGIS_ASSETS_PATH;
esriConfig.fontsUrl = __CONFIG__.ARCGIS_FONTS_URL;

const map = new EsriMap({
	basemap: "dark-gray-vector",
});
const view = new MapView({
	container: document.getElementById("map") as HTMLDivElement,
	map: map,
	center: [114.34, 30.555],
	scale: 54000,
});
async function asynFunc() {
	console.log(1);
}
const widget = new HelloWorld({ name: "xxxxx" });
view.ui.add(widget, "top-left");
