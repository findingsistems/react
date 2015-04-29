'use strict';

var _ = require('underscore');

var React = require('react/addons');
var PropTypes = React.PropTypes;

var PureRenderMixin = React.addons.PureRenderMixin;

var Emitter = require('utils/emitter.js');
var event_names = require('shared_constants/event_names.js');
var sc = require('shared_constants');

/* jshint ignore:start */
var GoogleMapMap = require('./google_map_map.jsx');
var GoogleMapMarkers = require('./google_map_markers.jsx');
/* jshint ignore:end */

var gmap_loader_ = require('third_party/google_map.js');

var merge = require('utils/merge.js');

var Geo = require('utils/geo.js');

var raf = require('utils/raf.js');

var kEPS = 0.00001;

var kMAP_CONTROL_OPTIONS = {
  overviewMapControl: false,
  streetViewControl: false,
  rotateControl: true,
  mapTypeControl: false,
  minZoom: 3,
  maxZoom: 22
};

var GoogleMap = React.createClass({  
  mixins: [PureRenderMixin],
  
  propTypes: {
    on_resize: PropTypes.func,
    on_bounds_changed: PropTypes.func, 
    center: PropTypes.array.isRequired,
    zoom: PropTypes.number.isRequired,
    restrict_bounds: PropTypes.array
  },

  on_window_resize () {
    var map_dom = this.refs.google_map_dom.getDOMNode();
    
    this.geo_service.set_view_size(map_dom.clientWidth, map_dom.clientHeight);
    
    this.props.on_resize && this.props.on_resize(map_dom.clientWidth, map_dom.clientHeight); //jshint ignore:line
  },

  on_bounds_changed (map) {
    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    this.geo_service.set_view([ne.lat(), sw.lng()], map.getZoom(), 0);
    this.props.on_bounds_changed && this.props.on_bounds_changed([ne.lat(), sw.lng()], map.getZoom()); //jshint ignore:line
  },

  
  check_bounds(map) { //не дать гуглокарте ускакать за пределы разрешенного

    var bounds = map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var center = bounds.getCenter();
    var zoom = map.getZoom();
    
    var lt_lat = this.props.restrict_bounds[0];
    var lt_lng = this.props.restrict_bounds[1];

    var br_lat = this.props.restrict_bounds[2];
    var br_lng = this.props.restrict_bounds[3];


    if(ne.lat() > lt_lat || sw.lat() < br_lat || 
    (sw.lng() < lt_lng || (sw.lng() > ne.lng() && center.lng() < 0)) ||
    (ne.lng() > br_lng || (sw.lng() > ne.lng() && center.lng() > 0))) {

      var map_dom = this.refs.google_map_dom.getDOMNode();      
      var geo_service = new Geo(sc.kGOOGLE_TILE_SIZE, sc.kCALC_MAP_TRANSFORM_FROM_LEFT_TOP);      
      geo_service.set_view_size(map_dom.clientWidth, map_dom.clientHeight);
      var br_lat_lng;

      if(ne.lat() > lt_lat) {
        geo_service.set_view([lt_lat, sw.lng()], zoom, 0);
        br_lat_lng = geo_service.unproject({x: map_dom.clientWidth/2, y: map_dom.clientHeight/2});        
      }

      if(sw.lat() < br_lat) {
        geo_service.set_view([br_lat, sw.lng()], zoom, 0);
        br_lat_lng = geo_service.unproject({x: map_dom.clientWidth/2, y: -map_dom.clientHeight/2});
      }
      
      
      if(sw.lng() < lt_lng || (sw.lng() > ne.lng() && center.lng() < 0)) {        
        geo_service.set_view([ne.lat(), lt_lng], zoom, 0);
        br_lat_lng = geo_service.unproject({x: map_dom.clientWidth/2, y: map_dom.clientHeight/2}); 
      }
      
      if(ne.lng() > br_lng || (sw.lng() > ne.lng() && center.lng() > 0)) {
        geo_service.set_view([ne.lat(), br_lng], zoom, 0);
        br_lat_lng = geo_service.unproject({x: -map_dom.clientWidth/2, y: map_dom.clientHeight/2}); 
      }

      map.setCenter({lat: br_lat_lng.lat, lng: br_lat_lng.lng});    
    }
  },
  
  componentWillMount() {
    var self = this;

    this.map = null;

    this.markers_dispatcher = merge(Emitter.prototype, {
      get_children() {
        return self.props.children;
      }
    });

    this.geo_service = new Geo(sc.kGOOGLE_TILE_SIZE, sc.kCALC_MAP_TRANSFORM_FROM_LEFT_TOP);
  },
  
  componentDidMount() {
    window.addEventListener('resize', this.on_window_resize);
    
    setTimeout(() => {
      this.on_window_resize ();
      
      var map_dom = this.refs.google_map_dom.getDOMNode();
      
      var gs = new Geo(sc.kGOOGLE_TILE_SIZE, sc.kCALC_MAP_TRANSFORM_FROM_LEFT_TOP);
      gs.set_view_size(map_dom.clientWidth, map_dom.clientHeight);
      gs.set_view([this.props.center[0], this.props.center[1]], this.props.zoom, 0); //от центральной точки
      var br_lat_lng = gs.unproject({x: -map_dom.clientWidth/2, y: -map_dom.clientHeight/2});
      
      this.geo_service.set_view([br_lat_lng.lat, br_lat_lng.lng], this.props.zoom, 0);

      gmap_loader_()
      .then(maps => {

        var br_lat_lng = this.geo_service.unproject({x: map_dom.clientWidth/2, y: map_dom.clientHeight/2});
        
        var map_options = _.extend({}, kMAP_CONTROL_OPTIONS, this.props.options);

        var mapOptions = _.extend({
          zoom: this.props.zoom,
          center: new maps.LatLng(br_lat_lng.lat, br_lat_lng.lng),
        }, map_options);
              
        var map = new maps.Map(this.refs.google_map_dom.getDOMNode(), mapOptions);
        this.map = map;

        //не вешать на bounds changed
        maps.event.addListener(map, 'center_changed', _.bind(this.check_bounds, this, map, maps));
        maps.event.addListener(map, 'zoom_changed', _.bind(this.check_bounds, this, map, maps));

        //----------------------------------------
        //render in overlay
        var self = this;
        var overlay = _.extend(new maps.OverlayView(), {
          onAdd() {
            var div = document.createElement('div');
            this.div = div;
            div.style.backgroundColor = 'transparent';
            div.style.position = 'absolute';
            div.style.left = '0px';
            div.style.right = '0px';
            div.style.width = '100px';
            div.style.height = '100px';
            var panes = this.getPanes();
            panes.overlayMouseTarget.appendChild(div);
            /* jshint ignore:start */
            React.render(
              <GoogleMapMarkers geo_service={self.geo_service} dispatcher={self.markers_dispatcher} />, //ice_main(null)
              div
            );
            /* jshint ignore:end */
          },

          draw() {
            var overlayProjection = this.getProjection();
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

            var div  = this.div;
            raf( () => {
              //div.style.transform = `translate(${ptx.x}px, ${ptx.y}px)`; //чтобы не было глюков с z-index и тп
              div.style.left = `${ptx.x}px`;
              div.style.top = `${ptx.y}px`;
              self.markers_dispatcher.fire(event_names.kON_CHANGE);
            });
            self.on_bounds_changed(map, maps);          
          }
        });

        overlay.setMap(map);

        maps.event.addListener(map, 'idle', () => {
            var div  = overlay.div;
            var overlayProjection = overlay.getProjection();
            var bounds = map.getBounds();
            var ne = bounds.getNorthEast();
            var sw = bounds.getSouthWest();
            var ptx = overlayProjection.fromLatLngToDivPixel(new maps.LatLng(ne.lat(), sw.lng()));

            raf( () => {
              //div.style.transform = `translate(${ptx.x}px, ${ptx.y}px)`; //чтобы не было глюков с z-index и тп
              div.style.left = `${ptx.x}px`;
              div.style.top  = `${ptx.y}px`;
              self.markers_dispatcher.fire(event_names.kON_CHANGE);
            });
            self.on_bounds_changed(map, maps);

        });
      })
      .catch( e => console.error(e));
    }, 0, this);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.on_window_resize);
    this.map = null;
    this.markers_dispatcher.destroy();

    delete this.map;
    delete this.markers_dispatcher;
  },

  componentWillReceiveProps(next_props) {
    if(this.map) {
      if(Math.abs(next_props.center[0] - this.props.center[0]) + Math.abs(next_props.center[1] - this.props.center[1]) > kEPS) {
        //this.map.setCenter({lat:next_props.center[0], lng:next_props.center[1]});
        var map_dom = this.refs.google_map_dom.getDOMNode();

        var gs = new Geo(sc.kGOOGLE_TILE_SIZE, sc.kCALC_MAP_TRANSFORM_FROM_LEFT_TOP);
        gs.set_view_size(map_dom.clientWidth, map_dom.clientHeight);
        gs.set_view([next_props.center[0], next_props.center[1]], this.state.map_initial_zoom, 0); //от центральной точки
        var br_lat_lng = gs.unproject({x: -map_dom.clientWidth/2, y: -map_dom.clientHeight/2});
        

        this.geo_service.set_view([br_lat_lng.lat, br_lat_lng.lng], next_props.zoom, 0);      
        br_lat_lng = this.geo_service.unproject({x: map_dom.clientWidth/2, y: map_dom.clientHeight/2});
        this.map.setCenter({lat:br_lat_lng.lat, lng:br_lat_lng.lng});
      }

      if(Math.abs(next_props.zoom - this.props.zoom) > 0) {
        this.map.setZoom(next_props.zoom);
      }
    }
  },

  componentDidUpdate() {
    this.markers_dispatcher.fire(event_names.kON_CHANGE);
  },

  render () {

    /* jshint ignore:start */
    return (
      <div className="google-map-holder">
        <GoogleMapMap ref="google_map_dom"/>
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = GoogleMap;
