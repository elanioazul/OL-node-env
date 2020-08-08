import 'ol/ol.css';
import { Map, View, Tile } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';

//controls
import FullScreen from 'ol/control/FullScreen';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher.js';

//legenda wms https://openlayers.org/en/latest/examples/wms-getlegendgraphic.html
import { Image as ImageLayer, Group as LayerGroup, Vector } from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS';

//wfs
import GML2 from 'ol/format/GML2.js'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { bbox as bboxStrategy, bbox } from 'ol/loadingstrategy.js'

//styles
import { Stroke, Style, Fill, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
// import Icon from 'ol/style/Icon.js';
// import * as fastfood from './img/icons8-street-food-100.png';
// import bakery from './img/icons8-bakery-100.png'
// import butchery from './img/icons8-butcher-100.png'
// import supermarket from './img/icons8-buying-100.png'
// import convenience from './img/icons8-convenince-store-100.png'
// import pastry from './img/icons8-cook-100.png'
// import frozenfood from './img/icons8-bakery-100.png'
// import greengrocer from './img/icons8-salad-100.png'
// import seafood from './img/icons8-seafood-100.png'

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
    opacity: 0.9,
    type: 'Overlays',
    title: 'ratio'
})

//WFS---------------------------------------------------------------------------------------

var comerciosSource = new VectorSource({
    format: new GeoJSON(),
    url: function (extent) {
        return (
            'http://localhost:8081/geoserver/unigis/wfs?service=WFS&' +
            'version=2.0.0&request=GetFeature&typeName=unigis:comercios_por_zonacensal_geometrias&' +
            'outputformat=application/json'
        );
    },
    strategy: bboxStrategy,
});

//WFS comercios style
var comerciosStyle1 = function (feature, resolution) { 
    return [new Style ({ 
        text: new Text ({ 
            font: '16px Calibri,sans-serif', 
            text: feature.get('brand'), 
            fill: new Fill ({ 
                color: '#d93d3d',
                width: 2 
            }), 
            stroke: new Stroke ({ 
                color: '#fff', 
                width: 2 
            }) 
        }),
        image: new CircleStyle ({ 
            radius: 3, 
            fill: new Fill ({ 
                color: 'orange'
            }), 
            stroke: new Stroke ({ 
                color: 'black'
            }) 
        })  
    })]; 
};

var comerciosCondStyle = function () {
    var fastfoodStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: fastfood
        })
    })
    var bakeryStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: bakery
        })
    })
    var butcheryStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: butchery
        })
    })
    var superStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: supermarket
        })
    })
    var convenienceStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: convenience
        })
    })
    var pastryStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: pastry
        })
        
    })
    var frozenfoodStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: frozenfood
        })
    })
    var veggieStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: greengrocer
        })
    })
    var seafoodStyle = new Style({
        image: new Icon({
            size: [100,100],
            anchor: [24,33],
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: seafood
        })
    })
}

var comerciosVector = new VectorLayer({
    source: comerciosSource,
    type: 'Overlays',
    title: 'comercios',
    style: comerciosStyle1
});



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
        layers: [indice, comerciosVector]
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

var layerSwitcher = new LayerSwitcher();

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


