define(['jquery'], function($) {

	function Switcher(layers) {
		this.layers = layers;
		var layersById = this.layersById = {};
		layers.forEach(function(layerDef) {
			layersById[layerDef[0]] = layerDef[1];
		});

		this._render();
		this._bind();
	}

	var proto = Switcher.prototype;



	proto._render = function() {
		this.$ = $('<div class="switcher">');
		this.layers.forEach(function(layerDef) {
			this.$.append(this._renderCheckbox(layerDef[0], layerDef[1]));
		}.bind(this));
	};

	proto._renderCheckbox = function(id, caption) {
		var line = $('<p><label><input type="checkbox" /><span></span></label></p>');
		line.find('span').text(caption);
		line.find('input').data('layer-id', id).attr('rel', 'layer');
		return line;
	};

	proto._bind = function() {
		this.$.on('click', '[rel="layer"]', this._change.bind(this));
	};

	proto._change = function(e) {
		var t = $(e.target);
		var layerId = t.data('layer-id');
		var state = t.prop('checked');
		var eventName = state ? 'enable' : 'disable';

		$(this).trigger(eventName, layerId);
	};

	proto.element = function() {
		return this.$;
	};

	return Switcher;

});