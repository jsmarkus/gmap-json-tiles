var Feature = (function(GeoJSON) {

    "use strict";

    /**
     * @class GeoJSON feature as Google maps overlays collection
     *
     * @param {[type]} json    [description]
     * @param {[type]} options [description]
     */
    function Feature(json, options) {
        this._options = options;
        this._overlays = [];
        if (json) {
            this.fromGeoJSON(json);
        }
    }

    var proto = Feature.prototype;

    /**
     * [fromGeoJSON description]
     * @param  {[type]} geoJson [description]
     * @return {[type]}      [description]
     */
    proto.fromGeoJSON = function(geoJson) {
        this.clear();
        var vector = new GeoJSON(geoJson, this._options);
        this.add(vector);
        this.properties = geoJson.properties;
        this.id = geoJson.id;
    };

    /**
     * Set Google map
     * @param {[type]} map [description]
     */
    proto.setMap = function(map) {
        this.map = map;
        var overlays = this._overlays;
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            overlay.setMap(this.map);
        }
    };

    /**
     * Add overlays
     * @param {[type]} overlays [description]
     */
    proto.add = function(overlays) {
        if (!Array.isArray(overlays)) {
            overlays = [overlays];
        }
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            if (!overlay || overlay.type === 'Error') {
                continue; //TODO: error handling
            }
            overlay.setMap(this.map);
            this._overlays.push(overlay);
        }
    };

    /**
     * Clear overlays
     * @return {[type]} [description]
     */
    proto.clear = function() {
        this.setMap(null);
        this._overlays = [];
        //TODO remove event listeners
    };

    /**
     * Set options for each overlay
     *
     * @param {[type]} options [description]
     */
    proto.setOptions = function(options) {
        var overlays = this._overlays;
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            overlay.setOptions(options);
        }
    };

    /**
     * addEventListener for each overlay
     *
     * @param {[type]} name    [description]
     * @param {[type]} handler [description]
     */
    proto.addListener = function(name, handler) {
        var overlays = this._overlays;
        for (var i = 0; i < overlays.length; i++) {
            var overlay = overlays[i];
            google.maps.event.addListener(overlay, name, handler);
        }
    };

    return Feature;
}(GeoJSON));