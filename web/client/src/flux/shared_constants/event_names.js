'use strict';

//enum
var event_names = {

  //TODO перейменовать в kSYS_блабла
  kON_CHANGE: 'kON_CHANGE',

  //route events
  kON_ROUTE_WILL_CHANGE: 'kON_BEFORE_ROUTE_CHANGE',
  kON_ROUTE_DID_CHANGE: 'kON_ROUTE_DID_CHANGE',
  kON_ROUTE_CHANGE_ERROR: 'kON_ROUTE_CHANGE_ERROR',

  //kON_WORK_FEATURE_CHECKED: 'kON_WORK_FEATURE_CHECKED',

  //suggestions
  kON_AUTO_PART_SUGGESTION_DATA_LOADED: 'kON_AUTO_PART_SUGGESTION_DATA_LOADED',  //юзер выбрал деталь в typeahead
  kON_AUTO_PART_SUGGESTION_VALUE_CHANGED: 'kON_AUTO_PART_SUGGESTION_VALUE_CHANGED', //надпись в тайпахеде изменилась
  kON_AUTO_PART_SUGGESTION_SEARCH_TERM_CHANGED: 'kON_AUTO_PART_SUGGESTION_SEARCH_TERM_CHANGED', //событие для показать в тайпахеде что то свое
  kON_AUTO_PART_SUGGESTION_SHOW_VALUE_CHANGED: 'kON_AUTO_PART_SUGGESTION_SHOW_VALUE_CHANGED', //пришли данные с сервера


  kON_AUTO_SERVICE_SUGGESTION_VALUE_CHANGED: 'kON_AUTO_SERVICE_SUGGESTION_VALUE_CHANGED', //юзер выбрал сервис в typeahead
  kON_AUTO_SERVICE_SUGGESTION_SEARCH_TERM_CHANGED: 'kON_AUTO_SERVICE_SUGGESTION_SEARCH_TERM_CHANGED', //надпись в тайпахеде изменилась
  kON_AUTO_SERVICE_SUGGESTION_SHOW_VALUE_CHANGED: 'kON_AUTO_SERVICE_SUGGESTION_SHOW_VALUE_CHANGED', //событие для показать в тайпахеде что то свое
  kON_AUTO_SERVICE_SUGGESTION_DATA_LOADED: 'kON_AUTO_SERVICE_SUGGESTION_DATA_LOADED', //пришли данные с сервера

  kON_REGION_LIST_LOADED: 'kON_REGION_LIST_LOADED',
  kON_REGION_CHANGED: 'kON_REGION_CHANGED',
  kON_CHANGE_REGION_SELECTION: 'kON_CHANGE_REGION_SELECTION',


  kON_DEFAULT_PAGE_SIZE_CHANGED: 'kON_DEFAULT_PAGE_SIZE_CHANGED',


  kON_SEARCH_PAGE_SIZE_CHANGED: 'kON_SEARCH_PAGE_SIZE_CHANGED', //на ресайз
  kON_SEARCH_PAGE_CHANGE_MAP_VISIBILITY: 'kON_SEARCH_PAGE_CHANGE_MAP_VISIBILITY', //на кнопку показать скрыть карту
  
  kON_SEARCH_PAGE_HEADER_RATING_STAR_HOVER: 'kON_SEARCH_PAGE_HEADER_RATING_STAR_HOVER', //по звездочкам рейтинга водим мышкой
  kON_SEARCH_PAGE_HEADER_RATING_STAR_CLICK: 'kON_SEARCH_PAGE_HEADER_RATING_STAR_CLICK',  //по звездочкам рейтинга кликаем

  kON_AUTO_PART_BY_ID_DATA_LOADED: 'kON_AUTO_PART_BY_ID_DATA_LOADED', //данные по детали по id
  kON_AUTO_PART_BY_ID_RESET_DATA: 'kON_AUTO_PART_BY_ID_RESET_DATA', 

  kON_AUTO_SERVICE_BY_ID_DATA_LOADED: 'kON_AUTO_SERVICE_BY_ID_DATA_LOADED', //данные по сервису по id
  kON_AUTO_SERVICE_BY_ID_RESET_DATA: 'kON_AUTO_SERVICE_BY_ID_RESET_DATA',


  kON_TEST_VALUE: 'kON_TEST_VALUE',
  kON_TEST_TOGGLE_BALLOON: 'kON_TEST_TOGGLE_BALLOON',
  kON_TEST_CLOSE_BALLOON: 'kON_TEST_CLOSE_BALLOON',
  kON_TEST_SHOW_PHONE: 'kON_TEST_SHOW_PHONE',


};

module.exports = event_names;
