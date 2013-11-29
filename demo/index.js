requirejs.config({
  baseUrl: 'src',
  paths: {
    'demo':'../demo',
    'jquery':'../bower_components/jquery/jquery',
    'GeoJSON':'../bower_components/geoJSON-to-Google-Maps/GeoJSON'
  },
  shim: {
    GeoJSON: {
      exports : 'GeoJSON'
    },
    Feature: {
      deps: ['GeoJSON'],
      exports : 'Feature'
    },
    JSONMapType: {
      deps: ['Feature'],
      exports : 'JSONMapType'
    }
  }
})

define(['demo/app']);