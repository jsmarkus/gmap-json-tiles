define([
    'jquery',
    'demo/OverlayMapTypeManager',
    'demo/Switcher',
    'demo/layers/Buildings',
    'demo/layers/Roads',
    'demo/layers/Pois',
], function(
    $,
    OverlayMapTypeManager,
    Switcher,
    BuildingsLayer,
    RoadsLayer,
    PoisLayer
) {
    var map;

    var mapOptions = {
        zoom: 17,
        center: new google.maps.LatLng(50.005635, 36.2265815),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map"),
        mapOptions);


    var layerManager = new OverlayMapTypeManager(map, {
        buildings: new BuildingsLayer(map),
        roads: new RoadsLayer(map),
        pois: new PoisLayer(map)
    });

    var switcher = new Switcher([
        ['buildings', 'Buildings'],
        ['roads', 'Roads'],
        ['pois', 'POIs']
    ]);

    $(switcher).on('enable', function(e, layerId) {
        layerManager.enable(layerId);
    });
    $(switcher).on('disable', function(e, layerId) {
        layerManager.disable(layerId);
    });

    switcher.element().appendTo('body');
});