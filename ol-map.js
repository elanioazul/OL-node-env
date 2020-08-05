import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import FullScreen from 'ol/control/FullScreen';
import {defaults as defaultControls, OverviewMap} from 'ol/control.js'

//LAYERS------------------ STUFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
var osm = new TileLayer({
    source: new OSM(),
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
})

//VIEW----------------- STUFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
var myview = new View({
    center: [-414243.053976, 4929595.937425],
    zoom: 14
})

//CONTROLS-------------- STUFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
var fullscreenbtn = new FullScreen({
    className: 'fullscreen',
})

var overview = new OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
        new TileLayer({
            source: new OSM({
                'url': 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
            })
        })
    ],
    collapsed: false,
    tipLabel: 'Mapa de referencia'
})

function init() {
    //Definimos la variable map que alojará nuestro mapa
    var map = new Map({
        target: 'map',
        layers: [osm],
        view: myview,
        controls: defaultControls().extend([
            fullscreenbtn, overview
        ])
    })
}

init();


