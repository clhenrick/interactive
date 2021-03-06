var app = (function(parent) {
  
  // the app's event listeners

  var el = parent.el;

  parent.eventListeners = function() {

    // only do the PostGIS query when the map has stopped panning or zooming
    // to prevent too many CDB SQL API requests from being made.
    el.map.on('moveend', function(){
      app.map.props.zoom = el.map.getZoom();
      
      if (app.map.props.zoom > 10 ) {
        app.circle.measureBBox();
        app.circle.queryCDB();
        app.ui.curveText();
      }
      
    });

    // we redraw the circle whenever the map is panning
    // perhaps doing this with L.circle isn't the best way to go
    //  as it stops drawing the circle when currently drawn tiles run out...
    el.map.on('move', function(){
      var zoom = el.map.getZoom();
      if (zoom >10) {
        app.circle.measureBBox();
        app.circle.makeBuffer();
        app.ui.curveText();
      }
    });

    // recalculate the position of the text over the circle
    $(window).on('resize', app.circleElems);
  };

  return parent;

})(app || {});