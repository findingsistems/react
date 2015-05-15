'use strict';

var kDEFAULT_STORE_PRIORITY = 100000;

var consts = {
  __DEV__: process.env.NODE_ENV !== "production",

  kITEMS_PER_PAGE: [5,10,15,20],
  kPAGES_ON_SCREEN: 10,
  kORGANIZATION_TYPES: [{id:0, title:'Автозапчасти'}, {id:1, title:'Автосервисы'}, {id:2, title:'Все организации'}],
  kORGANIZATION_PRICE_TYPES: [{id:1, title:'Розница'}, {id:2, title:'Опт'}],

  kPRICE_LIST_SELECTOR_PRICES_FROM: 0,
  kPRICE_LIST_SELECTOR_PRICES_TO: 100000,
  kPRICE_LIST_SELECTOR_PRICES_ROUND: 10,


  kON_ROUTE_DID_CHANGE__ROUTES_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_DATA_CHANGED__WORK_VIEW_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_AUTO_PART_SUGGESTION__SUGGESTIONS_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,
  kON_AUTO_SERVICE_SUGGESTION__SUGGESTIONS_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_DEFAULT_PAGE_SIZE_CHANGED__DEFAULT_PAGE_SIZE_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_REGION__REGION_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_SEARCH_PAGE_SIZE_CHANGED__SEARCH_PAGE_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_AUTO_PART_BY_ID__AUTO_PART_BY_ID_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_AUTOSERVICE_BY_ID__AUTO_SERVICE_BY_ID_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,
  kON_FIXED_TOOLTIP__FIXED_TOOLTIP_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_CATALOG_SUGGESTION__SUGGESTIONS_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_TEST_VALUE__TEST_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_CATALOG__CATALOG_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kON_FILIAL_ADDRESS_AND_WORK_TIME__FILIAL_ADDRESS_AND_WORK_TIME_PRIORITY: kDEFAULT_STORE_PRIORITY,
  kON_PRICE_LIST_SELECTOR__PRICE_LIST_SELECTOR_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kAUTH_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,
  kDEFAULT_STORE_PRIORITY: kDEFAULT_STORE_PRIORITY,

  kMAP_RESTRICT_BOUNDS: [70, -175, -70, 175],
  kMAP_MARKERS_MARGINS: [20,50,10,50], //насколько близко подгружать маркеры к краю карты

  kMAP_MIN_ZOOM_CHANGE_AT_WIDTH: 1600,

  //kGOOGLE_MAP_API_KEY: 'AIzaSyDoE60ueAva9YAW1ZtXqMx9UQhxD3iVKcw',
  // TODO вставить автогиперовский ключ
  kGOOGLE_MAP_API_KEY: null,

};

module.exports = consts;
