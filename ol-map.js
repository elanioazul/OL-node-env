import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import * as olControl from 'ol/control';
import {defaults} from 'ol/control';
import FullScreen from 'ol/control/FullScreen';


var osm = new TileLayer({
    source: new OSM(),
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
})

var myview = new View({
    center: [-414243.053976, 4929595.937425],
    zoom: 14
})

var fullscreenbtn = new FullScreen({
    className: 'fullscreen'

})

function init() {
    //Definimos la variable map que alojará nuestro mapa


    //al meter fullscreen btn he perdido los controles default zoom y attributions!!! mirar pqué!
    var map = new Map({
        target: 'map',
        layers: [osm],
        view: myview,
        controls: [fullscreenbtn]
    })
}

init();


