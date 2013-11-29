define(['JSONMapType'], function(JSONMapType) {
    function Layer(map) {

        var mapType = new JSONMapType(map, {

            featureOptions: {
                strokeColor: '#7FC8FF',
                strokeOpacity: 0.8,
                strokeWeight: 4,
            },

            tileUrl: function(coord, zoom) {
                return ['http://tile.openstreetmap.us',
                    'vectiles-skeletron',
                    zoom,
                    coord.x,
                    coord.y
                ].join('/') + '.json';
            }
        });

        return mapType;
    }


    return Layer;
});