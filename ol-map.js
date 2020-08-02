import 'ol/ol.css'
import {Map, View} from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'




var osm = new TileLayer({
    source: new OSM(),
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
})

//Definimos la variable map que alojará nuestro mapa
var map = new Map({
    target: 'map',
    layers: [osm],
    view: new View({
        center: [312807, 5156486],
        zoom: 14
    })
})