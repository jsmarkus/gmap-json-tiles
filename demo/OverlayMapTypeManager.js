define(function() {
    function OverlayMapTypeManager(map, layers) {
        this.map = map;
        this.layers = layers;
    }

    var proto = OverlayMapTypeManager.prototype;

    proto.enable = function(layerId) {
        var layer = this.layers[layerId];
        if (!layer) {
            throw new Error('unknown layer ' + layerId);
        }
        this.map.overlayMapTypes.push(layer);
    };

    proto.disable = function(layerId) {
        var layer = this.layers[layerId];
        if (!layer) {
            throw new Error('unknown layer ' + layerId);
        }

        var om = this.map.overlayMapTypes;
        for (var i = 0; i < om.getLength(); i++) {
            var omLayer = om.getAt(i);
            if (omLayer === layer) {
                om.removeAt(i);
                return;
            }
        }
    };

    return OverlayMapTypeManager;
});