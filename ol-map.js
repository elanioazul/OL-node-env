import 'ol/ol.css';
import { Map, View, Tile } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';

import FullScreen from 'ol/control/FullScreen';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';

import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher.js';
import TileWMS from 'ol/source/TileWMS.js';
//legenda wms https://openlayers.org/en/latest/examples/wms-getlegendgraphic.html
import { Image as ImageLayer, Group as LayerGroup, Vector } from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS';

//wfs
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import GML2 from 'ol/format/GML2.js'
import { bbox as bboxStrategy, bbox } from 'ol/loadingstrategy.js'
import WFS from 'ol/format/WFS';


//---------------------------------------------------------------
//LAYERS----------------------------------------------------------
//--------------------------------------------------------------

//served from third parties
//-------------------------
var osm = new TileLayer({
    title: 'OSM',//Título de la capa
    type: 'base',//Tipo de capa
    visible: true,
    source: new OSM(),
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
})

var stamenlayer = new TileLayer({
    title: 'Water color', //Título de la capa
    type: 'base',//Tipo de capa
    visible: false,
    source: new Stamen({
        layer: 'watercolor'
    })
})



//served from my own Geoserver
//-----------------------------

//WMS----------------------------------------------------------------------
var wmsSourceZonas = new ImageWMS({
    url: 'http://localhost:8081/geoserver/wms',
    params: {
        'LAYERS': 'indicadores_zonascenso_comercios',
        'FORMAT': 'image/png'
    },
    ratio: 1,
    serverType: 'geoserver',
});

var indice = new ImageLayer({
    extent: [-449755.474430, 4914663.447962, -398423.932424, 4952049.314483],
    source: wmsSourceZonas,
    opacity: 0.9
})

//WFS---------------------------------------------------------------------------------------
// var vectorComercios = new VectorLayer({
//     source: new VectorSource({
//         format: new GeoJSON(),
//         url: function (extent) {
//             return 'http://localhost:8081/geoserver/unigis/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=unigis:comercios_por_zonacensal_geometrias&maxFeatures=50&outputformat=json';
//         },
//         strategy: bboxStrategy
//     })
// })

var wfs = new VectorLayer(
    "comercioswfs",
    {
        strategies: bboxStrategy,
        protocol: new WFS({
            version: "1.1.0",
            url: "http://localhost:8081/geoserver/wfs",
            featurePrefix: 'unigis', //geoserver worspace name
            featureType: "unigis:comercios_por_zonacensal_geometrias", //geoserver Layer Name
            featureNS: "https://www.unigisprojectcensoosm.eu", // Edit Workspace Namespace URI
            geometryName: "geometry" // field in Feature Type details with type "Geometry"
        })
    }
);


//switch layer extension var
var mylayers = [
    //Base maps
    new LayerGroup({
        'title': 'Base maps',
        layers: [osm, stamenlayer]
    })
    ,
    //Capa Overlay
    new LayerGroup({
        title: 'Overlays',
        layers: [indice, wfs]
    })
]



//---------------------------------------------------------------------------
//VIEW-----------------------------------------------------------------------
//----------------------------------------------------------------------------
var myview = new View({
    center: [-414243.053976, 4929595.937425],
    zoom: 14
})

//----------------------------------------------------------------------------------
//CONTROLS---------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
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


var layerSwitcher = new LayerSwitcher({
    tipLabel: 'Leyenda'
})

//-------------------------------
//starting the app---------------
//-------------------------------
function init() {
    //Definimos la variable map que alojará nuestro mapa
    var map = new Map({
        target: 'map',
        layers: mylayers,
        view: myview,
        controls: defaultControls().extend([
            fullscreenbtn, overview, layerSwitcher
        ])
    })

}

init();


