'use strict';

var _ = require('underscore');
//var q = require('third_party/es6_promise.js');

var main_dispatcher = require('dispatchers/main_dispatcher.js');

var event_names = require('shared_constants/event_names.js');
var api_refs = require('shared_constants/api_refs.js');

var resource = require('utils/resource.js');
var action_export_helper = require('utils/action_export_helper.js');

var promise_serializer = require('utils/promise_serializer.js');
var memoize = require('utils/promise_memoizer.js');

var serializer = promise_serializer.create_serializer();

//var text_util = require('utils/text.js');

//15 минут експирация, хэш ключей 256, в случае коллизии хранить результатов не более 4 значений по хэш ключу
var kMEMOIZE_OPTIONS = {expire_ms: 60*15*1000, cache_size_power: 8, max_items_per_hash: 4};

var sass_vars = require('sass/common_vars.json')['yandex-map'];

var kCATALOG_DELTA_ID = [0, 10000000];
var kCATALOG_MARKER_TYPE = ['auto-part-marker-type', 'autoservice-marker-type'];
var kCATALOG_HINT = ['автозапчасти', 'автосервис'];
var kCATALOG_MARKER_COLOR = [sass_vars['auto-part-marker-color'], sass_vars['autoservice-marker-color']];
var kCATALOG_CLUSTER_COLOR = [sass_vars['cluster-marker-color'], sass_vars['cluster-marker-color']];

var r_catalog_data_ = resource(api_refs.kCATALOG_DATA);

var actions_ = [
  ['reset_catalog_data', event_names.kON_CATALOG_RESET_DATA],

  ['catalog_toggle_balloon', event_names.kON_CATALOG_TOGGLE_BALLOON],
  ['catalog_close_balloon', event_names.kON_CATALOG_CLOSE_BALLOON],
  ['catalog_show_phone', event_names.kON_CATALOG_SHOW_PHONE],
  ['catalog_marker_hover', event_names.kON_CATALOG_MARKER_HOVER],

  ['catalog_balloon_visible', event_names.kON_CATALOG_BALLOON_VISIBLE],

  ['catalog_map_bounds_changed_by_user', event_names.kON_CATALOG_MAP_BOUNDS_CHANGED_BY_USER],
  
  ['catalog_change_items_per_page', event_names.kON_CATALOG_CHANGE_ITEMS_PER_PAGE],
  ['catalog_change_page', event_names.kON_CATALOG_CHANGE_PAGE],
  ['catalog_search', event_names.kON_CATALOG_SEARCH],

  ['catalog_show_all_phones_on_current_page', event_names.kON_CATALOG_SHOW_ALL_PHONES_ON_CURRENT_PAGE],
];

module.exports.close_all_and_open_balloon = (id) => {
  //main_dispatcher.fire(event_names.kON_AUTOSERVICE_BY_ID_CLOSE_ALL_BALLOON);
  main_dispatcher.fire(event_names.kON_CATALOG_CLOSE_ALL_BALLOON);
  setTimeout( () => {
    main_dispatcher.fire(event_names.kON_CATALOG_TOGGLE_BALLOON, id);
  }, 200);
};

var query_catalog_data = (type, brands, services, region_text, price_type) => {
  return r_catalog_data_
    .get({
      type: type==='_' ? '' : type, 
      brands: brands==='_' ? '' : brands.join(','), 
      services: services==='_' ? '': services.join(','), 
      region_text: region_text,
      price_type: price_type
    })
    .then(res => {
      //console.log('res',res);
      if(_.isArray(res) && res.length === 0) {
        return {markers:[], results:[]};
      }
      //чистим данные с сервера
      var map_user_id = _.reduce(res.map, (memo,marker) => {
        memo[marker.user_id] = true; 
        return memo;
      }, {});
      
      var res_user_id = _.reduce(res.results, (memo,marker) => {
        memo[marker.user_id] = true; 
        return memo;
      }, {});      
      
      var markers = _.filter(res.map, m => m.user_id in res_user_id);
      
      //fillial_type_id

      markers = _.map(markers, (m, m_index) => 
        _.extend( { 
                    is_open: false,         //true если с этой метки открыт balloon или надо открыть-закрыть балун
                    show_phone: false,      //показывать ли телефон
                    balloon_visible: false, //конкретно именно этот balloon открыт на экране, 
                                            //в случае кластера может отличаться от is_open, 
                                            //например открыли балун по одной метке и переместились стрелками в карусели кластер балуна на другой
                                            //наличие этого поля объясняется неимоверной хреновостью yandex map api
                    on_current_page: false, //есть ли иконка на текущей старничке в табличке
                  }, //system
                  {
                    marker_color: kCATALOG_MARKER_COLOR[m.filial_type_id - 1], //так как цвета маркера задаются в апи явно то вынужден писать их тут а не в css
                    marker_type: kCATALOG_MARKER_TYPE[m.filial_type_id - 1],   //тип метки - автосервис или запчасть
                    hint: kCATALOG_HINT[m.filial_type_id - 1] + m.company_name //хинт что показывать на метке
                  }, //брать потом из базы
                  {
                    cluster_color: kCATALOG_CLUSTER_COLOR[m.filial_type_id - 1] //цвет иконки кластера
                  },
                  m,
                  {
                    server_id:m.id,    //настоящий id
                    id: m.id + kCATALOG_DELTA_ID[m.filial_type_id - 1],          //смещенный id
                    icon_number:m.rank //циферка на иконке
                  } ));


      markers = _.sortBy(markers, m => m.rank);


      var results = _.filter(res.results, m => m.user_id in map_user_id);
      
      results = _.map(results, res => _.extend({}, 
        res, 
        {
          is_hovered_same_rank: false,            //наведено на результат на карте или так
          is_hovered_same_address: false,         //наведено на результат и адрес совпадает с основным на карте или так
          is_balloon_visible_same_rank: false,    //открыт балун с таким же ранком
          is_balloon_visible_same_address: false  //открыт балун с такимже ранком и на том же адресе что и соновной
        }));
      
      //header:res.header, 
      var res_converted = {markers:markers, results:results};

      //console.log('catalog res 2::: ', res_converted);
      //_.each(res_converted.results, r => console.log(r.id, r.rank, r.user_id));

      /*
        code: "5c5845011qnvb"
        id: 2751411
        manufacturer: "vag"
        name: "стекло ветровое"
        rank: 1
        retail_price: "12750"
        stock: 1 //поле не забыть доставка 1;"В наличии", 2;"2-7 дней", 3;"7-14 дней", 4;"14-21 дня", 5;"до 31 дня"
        used: true
        user_id: 16405
        wholesale_price: null
        
      //на экране видим
        rank
        ближайший продавец
        manufacturer + code
        name
        stock + used
        retail_price
        телефон-заявка
      */

      return res_converted;
    });
};

var query_catalog_data_memoized = memoize(query_catalog_data, kMEMOIZE_OPTIONS);

module.exports.query_catalog_data = (type, brands, services, region_text, price_type) => {
  return serializer( () => query_catalog_data_memoized(type, brands, services, region_text,price_type)
    .then(res => {
      
      main_dispatcher.fire.apply (main_dispatcher, [event_names.kON_CATALOG_DATA_LOADED].concat([res]));
      return res;
    })
  )
  .catch(e => {
    if(promise_serializer.is_skip_error(e)) {
      //console.log('SKIPPED')
    } else {
      console.error(e, e.stack);
      throw e;
    }
  });
};

module.exports = _.extend({}, module.exports, action_export_helper(actions_));
