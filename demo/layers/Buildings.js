define(['JSONMapType'], function(JSONMapType) {
    function Layer(map) {
        var iw = new google.maps.InfoWindow();


        var mapType = new JSONMapType(map, {

            featureOptions: {
                fillColor: '#999',
                fillOpacity: 0.5,
                strokeColor: 'black',
                strokeWeight: 1,
            },

            onFeature: function(feature) {
                feature.addListener('click', featureClick.bind(null, map, iw, feature));
            },

            tileUrl: function(coord, zoom) {
                return ['http://tile.openstreetmap.us',
                    'vectiles-buildings',
                    zoom,
                    coord.x,
                    coord.y
                ].join('/') + '.json';
            }
        });

        return mapType;
    }


    function featureClick(map, iw, feature, event) {
        iw.setPosition(event.latLng);
        iw.setContent(feature.properties.name);
        iw.open(map);
    }


    return Layer;
});