var GMapJSONTiles = (function() {





//--------

var GeoJSON = function( geojson, options ){

	var _geometryToGoogleMaps = function( geojsonGeometry, opts, geojsonProperties ){
		
		var googleObj;
		
		switch ( geojsonGeometry.type ){
			case "Point":
				opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[1], geojsonGeometry.coordinates[0]);
				googleObj = new google.maps.Marker(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPoint":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					opts.position = new google.maps.LatLng(geojsonGeometry.coordinates[i][1], geojsonGeometry.coordinates[i][0]);
					googleObj.push(new google.maps.Marker(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "LineString":
				var path = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var coord = geojsonGeometry.coordinates[i];
					var ll = new google.maps.LatLng(coord[1], coord[0]);
					path.push(ll);
				}
				opts.path = path;
				googleObj = new google.maps.Polyline(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiLineString":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var coord = geojsonGeometry.coordinates[i][j];
						var ll = new google.maps.LatLng(coord[1], coord[0]);
						path.push(ll);
					}
					opts.path = path;
					googleObj.push(new google.maps.Polyline(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "Polygon":
				var paths = [];
				var exteriorDirection;
				var interiorDirection;
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
						path.push(ll);
					}
					if(!i){
						exteriorDirection = _ccw(path);
						paths.push(path);
					}else if(i == 1){
						interiorDirection = _ccw(path);
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}else{
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}
				}
				opts.paths = paths;
				googleObj = new google.maps.Polygon(opts);
				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}
				break;
				
			case "MultiPolygon":
				googleObj = [];
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++){
					var paths = [];
					var exteriorDirection;
					var interiorDirection;
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++){
						var path = [];
						for (var k = 0; k < geojsonGeometry.coordinates[i][j].length; k++){
							var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][k][1], geojsonGeometry.coordinates[i][j][k][0]);
							path.push(ll);
						}
						if(!j){
							exteriorDirection = _ccw(path);
							paths.push(path);
						}else if(j == 1){
							interiorDirection = _ccw(path);
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}else{
							if(exteriorDirection == interiorDirection){
								paths.push(path.reverse());
							}else{
								paths.push(path);
							}
						}
					}
					opts.paths = paths;
					googleObj.push(new google.maps.Polygon(opts));
				}
				if (geojsonProperties) {
					for (var k = 0; k < googleObj.length; k++){
						googleObj[k].set("geojsonProperties", geojsonProperties);
					}
				}
				break;
				
			case "GeometryCollection":
				googleObj = [];
				if (!geojsonGeometry.geometries){
					googleObj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
				}else{
					for (var i = 0; i < geojsonGeometry.geometries.length; i++){
						googleObj.push(_geometryToGoogleMaps(geojsonGeometry.geometries[i], opts, geojsonProperties || null));
					}
				}
				break;
				
			default:
				googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
		}
		
		return googleObj;
		
	};
	
	var _error = function( message ){
	
		return {
			type: "Error",
			message: message
		};
	
	};

	var _ccw = function( path ){
		var isCCW;
		var a = 0;
		for (var i = 0; i < path.length-2; i++){
			a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
		}
		if(a > 0){
			isCCW = true;
		}
		else{
			isCCW = false;
		}
		return isCCW;
	};
		
	var obj;
	
	var opts = options || {};
	
	switch ( geojson.type ){
	
		case "FeatureCollection":
			if (!geojson.features){
				obj = _error("Invalid GeoJSON object: FeatureCollection object missing \"features\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.features.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.features[i].geometry, opts, geojson.features[i].properties));
				}
			}
			break;
		
		case "GeometryCollection":
			if (!geojson.geometries){
				obj = _error("Invalid GeoJSON object: GeometryCollection object missing \"geometries\" member.");
			}else{
				obj = [];
				for (var i = 0; i < geojson.geometries.length; i++){
					obj.push(_geometryToGoogleMaps(geojson.geometries[i], opts));
				}
			}
			break;
		
		case "Feature":
			if (!( geojson.properties && geojson.geometry )){
				obj = _error("Invalid GeoJSON object: Feature object missing \"properties\" or \"geometry\" member.");
			}else{
				obj = _geometryToGoogleMaps(geojson.geometry, opts, geojson.properties);
			}
			break;
		
		case "Point": case "MultiPoint": case "LineString": case "MultiLineString": case "Polygon": case "MultiPolygon":
			obj = geojson.coordinates
				? obj = _geometryToGoogleMaps(geojson, opts)
				: _error("Invalid GeoJSON object: Geometry object missing \"coordinates\" member.");
			break;
		
		default:
			obj = _error("Invalid GeoJSON object: GeoJSON object must be one of \"Point\", \"LineString\", \"Polygon\", \"MultiPolygon\", \"Feature\", \"FeatureCollection\" or \"GeometryCollection\".");
	
	}
	
	return obj;
	
};


//--------

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

//--------

var JSONMapType = (function(Feature) {
    "use strict";

    /**
     * @class Custom map type that shows GeoJSON tiles on google map
     *
     * - options.tileSize {google.maps.Size}
     * - options.featureOptions {Object}
     * - options.onFeature {function (feature, featureKey)}
     * - options.request {function (url, onSuccess, onError)}
     * - options.tileUrl {function (coord, zoom)}
     *
     * @implements {google.maps.MapType}
     * @param {google.maps.Map} map
     * @param {Object} options
     */

    function JSONMapType(map, options) {
        options = options || {};
        this.tileSize = options.tileSize || new google.maps.Size(256, 256);
        this.featureOptions = options.featureOptions || false;
        this.onFeature = options.onFeature || false;
        this.tileUrl = options.tileUrl;
        if ('function' !== typeof this.tileUrl) {
            throw new TypeError('options.tileUrl must be function');
        }

        this.request = options.request || false;
        if (false !== this.request) {
            if ('function' !== typeof this.request) {
                throw new TypeError('options.request must be function');
            }
        }


        this.map = map;
        this._featureRefCount = {};
        this._featureByTile = {};
        this._featureByKey = {};
        this._queuedTiles = {};
    }

    var proto = JSONMapType.prototype;



    /**
     * Called by Google Maps. Returns tile container.
     *
     * Actually no container is needed for this layer, but Google Maps requires HTMLElement to be returned from this function.
     * Besides that, it passes this element to releaseTile method, so we use the DIV to store some info for further garbage collection.
     *
     * @param  {google.maps.Point} coord         [description]
     * @param  {Number}            zoom          [description]
     * @param  {HTMLDocument}      ownerDocument [description]
     * @return {HTMLElement}               [description]
     */
    proto.getTile = function(coord, zoom, ownerDocument) {
        var tid = tileId(coord, zoom);
        var div = ownerDocument.createElement('div');
        div.setAttribute('data-id', tid);
        this._loadTile(coord, zoom);
        return div;
    };



    /**
     * Called by Google Maps each time the tile is out of viewport.
     *
     * @param  {HTMLElement} node [description]
     */
    proto.releaseTile = function(node) {
        var tid = node.getAttribute('data-id');
        this._unsetTileQueued(tid);

        if (this.onRemoveTile) {
            this.onRemoveTile(tid);
        }
        this._unlinkFeaturesFromTile(tid);
    };



    /**
     * Load tile from the GeoJSON tile server.
     *
     * @param  {google.maps.Point} coord [description]
     * @param  {Number} zoom  [description]
     */
    proto._loadTile = function(coord, zoom) {
        var tid = tileId(coord, zoom);
        var turl = this.tileUrl(coord, zoom);

        var onSuccess = this._onTileLoaded.bind(this, tid, zoom);
        var onError = this._unsetTileQueued.bind(this, tid); //Check and test!

        this._setTileQueued(tid);
        if (this.request) {
            this.request(turl, onSuccess, onError);
        } else {
            $.ajax({
                url: turl,
                type: 'get',
                dataType: 'json'
            }).done(onSuccess).fail(onError);
        }

    };



    /**
     * Handle GeoJSON response
     *
     * @param  {String} tid  [description]
     * @param  {Number} zoom [description]
     * @param  {Object} json [description]
     */
    proto._onTileLoaded = function(tid, zoom, json) {
        if (!this._isTileQueued(tid)) {
            return;
        }


        this._unsetTileQueued(tid);

        var features = json.features;
        if (this.onAddTile) {
            this.onAddTile(tid);
        }
        for (var i = 0; i < features.length; i++) {
            var f = features[i];
            this._addFeature(f, tid, zoom);
        }
    },



    /**
     * Mark tile as queued from the server.
     *
     * Used to avoid race condition, when the server response comes
     * later than the tile is actually out of viewport.
     * It often happens, when the user quickly zoomes in and
     * out several times.
     *
     * @param {String} tid [description]
     */
    proto._setTileQueued = function(tid) {
        //TODO use tkey to respect zoom!
        this._queuedTiles[tid] = true;
    };



    /**
     * Mark tile as not queued from server.
     *
     * @see _setTileQueued
     * @param  {String} tid [description]
     */
    proto._unsetTileQueued = function(tid) {
        delete this._queuedTiles[tid];
    };



    /**
     * Checks if the tile is queued.
     *
     * @see _setTileQueued
     * @param  {String}  tid [description]
     * @return {Boolean}     [description]
     */
    proto._isTileQueued = function(tid) {
        return !!this._queuedTiles[tid];
    };



    /**
     * Links a feature to tile.
     *
     * In order to properly clean the unused features,
     * we must know which tiles they belong to.
     * One feature may belong to several tiles, so we have to
     * register all tile-to-feature relations.
     * Further, when all the tiles that use the feature are removed,
     * the feature may also be removed.
     *
     * @see _incFeatureRefCount
     * @see _decFeatureRefCount
     * @see _getFeatureRefCount
     *
     * @param  {Number} zoom [description]
     * @param  {String} fid  [description]
     * @param  {String} tid  [description]
     */
    proto._linkFeatureToTile = function(zoom, fid, tid) {
        var fkey = featureKey(zoom, fid);

        if (!this._featureByTile[tid]) {
            this._featureByTile[tid] = [];
        }

        this._featureByTile[tid].push(fkey); //TODO: check indexOf()?

        this._incFeatureRefCount(fkey);
    };



    /**
     * Unlinks all features from the tile.
     *
     * When the tile is removed, we must remove all the relations
     * between it and features it used.
     * Also this function decreases reference counters of features.
     *
     * @param  {String} tid [description]
     */
    proto._unlinkFeaturesFromTile = function(tid) {
        var featureKeys = this._featureByTile[tid];
        if (!featureKeys) {
            return;
        }
        for (var i = 0; i < featureKeys.length; i++) {
            var fkey = featureKeys[i];
            this._decFeatureRefCount(fkey);
        }
    };



    /**
     * Gets count of references of the feature.
     *
     * Feature reference counters are used to find out if the feature
     * may be "garbage collected".
     * It shows how many tiles use this feature.
     *
     *
     * @param  {String} fid [description]
     * @return {Number}     [description]
     */
    proto._getFeatureRefCount = function(fid) {
        var count = this._featureRefCount[fid] || 0;
        return count;
    };



    /**
     * Increase reference counter of the feature.
     *
     * @see _getFeatureRefCount
     * @param  {String} fkey [description]
     */
    proto._incFeatureRefCount = function(fkey) {
        this._featureRefCount[fkey] = this._getFeatureRefCount(fkey) + 1;
    };



    /**
     * Decrease reference counter of the feature.
     *
     * If the counter is 0, the feature is removed.
     *
     * @see _getFeatureRefCount
     * @param  {String} fkey [description]
     */
    proto._decFeatureRefCount = function(fkey) {
        var c = this._getFeatureRefCount(fkey);
        if (!c) {
            return;
        }

        c--;

        if (!c) {
            delete this._featureRefCount[fkey];
            this._removeFeature(fkey);
        } else {
            this._featureRefCount[fkey] = c;
        }
    };



    /**
     * Converts GeoJSON to feature, adds the feature on the map and
     * registers it.
     *
     * @param {Object} jsonFeature [description]
     * @param {String} tid         [description]
     * @param {Number} zoom        [description]
     */
    proto._addFeature = function(jsonFeature, tid, zoom) {
        var fid = jsonFeature.id;
        var fkey = featureKey(zoom, fid);


        if (!this._featureByKey[fkey]) {
            var feature = new Feature(jsonFeature, this.featureOptions);
            if (this.onFeature) {
                this.onFeature(feature, fkey);
            }


            feature.setMap(this.map);
            this._featureByKey[fkey] = feature;

            if (this.onAddFeature) {
                this.onAddFeature(fkey, feature);
            }
        }
        this._linkFeatureToTile(zoom, fid, tid);
    },



    /**
     * Removes the feature from the map and unregisters it.
     *
     * @param  {String} fkey [description]
     */
    proto._removeFeature = function(fkey) {
        var feature = this._featureByKey[fkey];
        if (this.onRemoveFeature) {
            this.onRemoveFeature(fkey, feature);
        }
        feature.clear();
        delete this._featureByKey[fkey];
    };



    /**
     * Creates feature key from zoom and feature id.
     * This key is used as unique identifier for tile-to-feature
     * relations management.
     *
     * @param  {Number} zoom [description]
     * @param  {String} fid  [description]
     * @return {String}      [description]
     */

    function featureKey(zoom, fid) {
        return [zoom, fid].join('|');
    }



    /**
     * Creates tile id from coordinates and zoom.
     *
     * This id is used for tile-to-feature
     * relations management.
     *
     * @param  {google.maps.Point} coord [description]
     * @param  {Number} zoom  [description]
     * @return {String}       [description]
     */

    function tileId(coord, zoom) {
        return [coord.x, coord.y, zoom].join('|');
    }



    return JSONMapType;

}(Feature));

//--------




    return {
        Feature: Feature,
        JSONMapType: JSONMapType
    }
}());