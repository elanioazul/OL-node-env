import 'ol/ol.css';
import { Map, View, Tile } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Stamen from 'ol/source/Stamen';

//controls
import FullScreen from 'ol/control/FullScreen';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import LayerSwitcher from 'ol-layerswitcher/src/ol-layerswitcher.js';

//interactions
import Interaction from 'ol/interaction/Interaction';
import {click, pointerMove} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';
import {defaults as defaultInteractions} from 'ol/interaction.js';

//legenda wms 
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
import Icon from 'ol/style/Icon.js';

//Overlays
import Overlay from 'ol/Overlay.js'

// import fastfood from './img/icons8-street-food-100.png';
// import bakery from './img/icons8-bakery-100.png';
// import butchery from './img/icons8-butcher-100.png';
// import supermarket from './img/icons8-buying-100.png';
// import convenience from './img/icon8s-convenience-store-100.png';
// import pastry from './img/icons8-cook-100.png';
// import frozenfood from './img/icons8-ice-cream-scoop-100.png';
// import greengrocer from './img/icons8-salad-100.png';
// import seafood from './img/icons8-seafood-100.png';

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

var comerciosCond1 = function (feature, resolution) { 
    if (feature.get('shop') == 'other') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: 'orange'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })]; 
    } else if (feature.get('shop') == 'bakery') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: 'blue'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })]; 
    } else if (feature.get('shop') == 'butcher') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: '#f522f1'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })]; 
    } else if (feature.get('shop') == 'supermarket') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: '#22eef5'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })]; 
    } else if (feature.get('shop') == 'convenience') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: 'red'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })]; 
    } else if (feature.get('shop') == 'pastry') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: '#22eef5'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })];
    } else if (feature.get('shop') == 'frozen_food') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: '#22f542'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })];
    } else if (feature.get('shop') == 'greengrocer') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: '#efff08'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })];
    } else if (feature.get('shop') == 'seafood') {
        return [new Style ({ 
            image: new CircleStyle ({ 
                radius: 4, 
                fill: new Fill ({ 
                    color: 'white'
                }), 
                stroke: new Stroke ({ 
                    color: 'black'
                }) 
            })  
        })];
    }

};

var comerciosCond2 = function (feature, resolution) { 
    if (feature.get('shop') == 'other') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-street-food-100.png',
                crossOrigin: 'anonymous',
            })
        })]; 
    } else if (feature.get('shop') == 'bakery') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-bakery-100.png',
                crossOrigin: 'anonymous',
            })
        })]; 
    } else if (feature.get('shop') == 'butcher') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-butcher-100.png',
                crossOrigin: 'anonymous',
            })
        })]; 
    } else if (feature.get('shop') == 'supermarket') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-buying-100.png',
                crossOrigin: 'anonymous',
            })
        })]; 
    } else if (feature.get('shop') == 'convenience') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-convenience-store-100.png',
                crossOrigin: 'anonymous',
            })
        })]; 
    } else if (feature.get('shop') == 'pastry') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-cook-100.png',
                crossOrigin: 'anonymous',
            })  
        })];
    } else if (feature.get('shop') == 'frozen_food') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-ice-cream-scoop-100.png',
                crossOrigin: 'anonymous',
            })
        })];
    } else if (feature.get('shop') == 'greengrocer') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-salad-100.png',
                crossOrigin: 'anonymous',
            })
        })];
    } else if (feature.get('shop') == 'seafood') {
        return [new Style({
            image: new Icon({
                size: [100,100],
                anchor: [24,33],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                src: './img/icons8-seafood-100.png',
                crossOrigin: 'anonymous',
            })
        })];
    }

};

var fastfoodxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-street-food-100.png',
        crossOrigin: 'anonymous',
    })
})

var bakeryxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-bakery-100.png',
        crossOrigin: 'anonymous',
    })
})

var butcherxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-butcher-100.png',
        crossOrigin: 'anonymous',
    })
})

var supermarketxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-buying-100.png',
        crossOrigin: 'anonymous',
    })
})

var conveniencexop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-convenience-store-100.png',
        crossOrigin: 'anonymous',
    })
})

var pastryxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-cook-100.png',
        crossOrigin: 'anonymous',
    })  
})

var frozenfoodxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-ice-cream-scoop-100.png',
        crossOrigin: 'anonymous',
    })
})

var greengrocerxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-salad-100.png',
        crossOrigin: 'anonymous',
    })
})

var seafoodxop = new Style({
    image: new Icon({
        size: [100,100],
        anchor: [24,33],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'img/icons8-seafood-100.png',
        crossOrigin: 'anonymous',
    })
})


var comerciosVector = new VectorLayer({
    source: comerciosSource,
    type: 'Overlays',
    title: 'comercios',
    style: comerciosCond1
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

//---------------------------------
//INTERACTIONS------------------------
//---------------------------------
var selectInteraction = new Select({
    condition: click,
    layers: [comerciosVector],
    style: new Style ({ 
        image: new CircleStyle ({ 
            opacity: 0.5,
            radius: 6, 
            fill: new Fill ({ 
                color: '#dff5e5'
            }), 
            stroke: new Stroke ({ 
                color: '#00fcf8'
            }) 
        })  
    })
})

//-----------------------------------
//OVERLAY--------------------------------
//-----------------------------------
var popup = new Overlay({
    element: document.getElementById('popup')
})


//--------------------------------
//LEGEND-----------------------
//---------------------------------
var wmsSourceLegend = new ImageWMS({
    url: 'http://localhost:8081/geoserver/wms',
    params: {
        'LAYERS': 'unigis:indicadores_zonascenso_comercios',
        'LEGEND_OPTIONS': {
            'fontSize': '10',
            'bgColor': '0xc1d6dd', 
            'fontColor': '0x1d2247'
        }
    },
    ratio: 1,
    serverType: 'geoserver'
})

var updateLegend = function (resolution) {
    var graphicUrl = wmsSourceLegend.getLegendUrl(resolution);
    var img = document.getElementById('legend');
    img.src = graphicUrl;
  };



//-------------------------------
//starting the app---------------
//-------------------------------
function init() {
    var map = new Map({
        target: 'map',
        layers: mylayers,
        view: myview,
        controls: defaultControls().extend([
            fullscreenbtn, overview, layerSwitcher
        ]),
        interactions: defaultInteractions().extend([
            selectInteraction
        ]),
        overlays: [popup]
    })
    // comerciosVector.once('load', function(e) {
    //     comerciosVector.getSource().forEachFeature(function(feature) {
    //         if (feature.getProperties().shop == 'other') {
    //             feature.setStyle(fastfoodxop)
    //             //console.log('soy fasfood')
    //         } else if (feature.getProperties().shop == 'bakery') {
    //             feature.setStyle(bakeryxop)
    //             //console.log('soy bakery')
    //         } else if (feature.getProperties().shop == 'butcher') {
    //             feature.setStyle(butcherxop)
    //             //console.log('soy butcher')
    //         } else if (feature.getProperties().shop == 'supermarket') {
    //             feature.setStyle(supermarketxop)
    //             //console.log('soy super')
    //         } else if (feature.getProperties().shop == 'convenience') {
    //             feature.setStyle(conveniencexop)
    //             //console.log('soy convenience')
    //         } else if (feature.getProperties().shop == 'pastry') {
    //             feature.setStyle(pastryxop)
    //             //console.log('soy pastries and buenri')
    //         } else if (feature.getProperties().shop == 'frozen_food') {
    //             feature.setStyle(frozenfoodxop)
    //             //console.log('soy frozen')
    //         } else if (feature.getProperties().shop == 'greengrocer') {
    //             feature.setStyle(greengrocerxop)
    //             //console.log('soy vegeta')
    //         } else if (feature.getProperties().shop == 'seafood') {
    //             feature.setStyle(seafoodxop)
    //             //console.log('soy fishes')
    //         }
    //     })
     
    // })

    // Initial legend
    var resolution = map.getView().getResolution();
    updateLegend(resolution);
  
    // Update the legend when the resolution changes
    map.getView().on('change:resolution', function (event) {
      var resolution = event.target.getResolution();
      updateLegend(resolution);
    });

    map.addOverlay(popup);

    const overlayFeatureAmenity = document.getElementById('feature-amenity');
    const overlayFeatureBrand = document.getElementById('feature-brand');
    const overlayFeatureName = document.getElementById('feature-name');
    const overlayFeatureShop = document.getElementById('feature-shop');

    map.on('click', function(e) {
        popup.setPosition(undefined);
        map.forEachFeatureAtPixel(e.pixel, function(feature, comerciosVector){
            let clickedCoord = e.coordinate;
            let clickedFeatureAmenity = feature.get('amenity');
            let clickedFeatureBrand = feature.get('brand');
            let clickedFeatureName = feature.get('name');
            let clickedFeatureShop = feature.get('shop');
            popup.setPosition(clickedCoord);
            overlayFeatureAmenity.innerHTML = clickedFeatureAmenity;
            overlayFeatureBrand.innerHTML = clickedFeatureBrand;
            overlayFeatureName.innerHTML = clickedFeatureName;
            overlayFeatureShop.innerHTML = clickedFeatureShop;

            map.setView(new View({
                center: clickedCoord,
                zoom: 15
            }))
            
        })
    })
}



init();


