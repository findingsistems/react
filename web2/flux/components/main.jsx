'use strict';

var React = require('react/addons');


var route_names = require('shared_constants/route_names.js');
var routes_store = require('stores/routes_store.js');


var rafBatchStateUpdateMixinCreate =require('./mixins/raf_state_update.js');
var PureRenderMixin = React.addons.PureRenderMixin;

/* jshint ignore:start */
var Header = require('components/header/header.jsx');
var Footer = require('components/footer.jsx');
var DefaultPage = require('components/default/default_page.jsx');

var Agreement = require('components/static/agreement.jsx');
var SearchBlockHeader = require('components/search_page/search_block_header.jsx');

var Link = require('components/link.jsx');

var SearchPageYandexMap = require('components/search_page/search_page_yandex_map.jsx');
var SearchPageRightBlockContent = require('components/search_page/search_page_right_block_content.jsx');

var CatalogPageRightBlockContent = require('components/catalog_page/catalog_page_right_block_content.jsx');
//потому что ES6 модуль
//var {CatalogPageRightBlockContentNew}= require('components/catalog_page_new/catalog_page_right_block_content_new.jsx');
import CatalogPageRightBlockContentNew from 'components/catalog_page_new/catalog_page_right_block_content_new.jsx';

var GoogleMapBlockNew = require('components/google/google_map_block_new.jsx');

var PriceListSelectionBlock = require('components/test/price_list_selection_block.jsx');

var AccountInfo = require('components/account/info.jsx');
var CompanyInfo = require('components/company/company.jsx');
var AccountServices = require('components/account/services.jsx');
var AccountManage = require('components/account/account_manage.jsx');
var AccountManageHistory = require('components/account/account_manage_history.jsx');
var AccountStatistics = require('components/account/account_statistics.jsx');

var Menu = require('components/menu/menu.jsx');
/* jshint ignore:end */



var auth_store = require('stores/auth_store.js');
var immutable = require('immutable');


//State update and stores for which we need intercept kON_CHANGE events
var RafBatchStateUpdateMixin = rafBatchStateUpdateMixinCreate(() => ({ //state update lambda
	router_state: routes_store.get_route_state_ro(),
	router_context_params: routes_store.get_route_context_params(),
  check_done : auth_store.get_check_done()
}),
routes_store,auth_store /*observable store list*/);

//var TypeaheadPage = require('./typeahead/typeahead_page.jsx');


var auth_actions = require('actions/auth_actions.js');



//auth_actions.check_auth();
var cx = require('classnames');
var ice_main = React.createClass({
	mixins: [PureRenderMixin, RafBatchStateUpdateMixin],


	render () {
		var MainContent = (function(router_state, router_context_params) {
//console.log(router_state, router_context_params);
			switch(router_state) {
				case route_names.kROUTE_R_A:
				case route_names.kROUTE_R_B:
				case route_names.kROUTE_R_C:
					return (
						<div>
							<Link href={route_names.kROUTE_R_A}>{route_names.kROUTE_R_A}</Link><br/>
							<Link href={route_names.kROUTE_R_B}>{route_names.kROUTE_R_B}</Link><br/>
							<Link href={route_names.kROUTE_R_C}>{route_names.kROUTE_R_C}</Link><br/>
						</div>
					);

				break;


        case route_names.kROUTE_AGREEMENT:

          return (
            <SearchBlockHeader>
              <div className='account-container-wrapper'>
                <div className='account-container'>
                  <Agreement />
                </div>
              </div>
            </SearchBlockHeader>
          );
          break;
				case route_names.kROUTE_DEF:
				case route_names.kROUTE_DEF_W_REGION:
        case route_names.kROUTE_ADV:
					/* jshint ignore:start */
					return (
						<DefaultPage route_context={router_context_params}/>
					);
					/* jshint ignore:end */
				break;
				//ВСЕ СТРАНИЧКИ У КОТОРЫХ ЕСТЬ ВВЕРХУ ПОИСК
				//ОТЛИЧАЮТСЯ ТОЛЬКО КОНТЕНТОМ Конкретно эти две kROUTE_PARTS_FIND и kROUTE_CATALOG только правым блоком - карта одинаковая
				case route_names.kROUTE_PARTS_FIND:
				case route_names.kROUTE_CATALOG:
				//ВОТ ТУТ МОЖНО МУТИТЬ ПОДРОУТИНГ ДЛЯ ВСЕХ СТРАНИЧЕК С ПОИСКОМ ВВЕРХУ
					var RightBlockContent = (function(router_state) {
					  switch(router_state) {
						case route_names.kROUTE_PARTS_FIND:
						  return <SearchPageRightBlockContent />;
						break;
						case route_names.kROUTE_CATALOG:
						  return <CatalogPageRightBlockContent />;
						break;
					  }
					}) (router_state);


					return (
						<SearchBlockHeader>
							<div ref='main_content' className="search-page-main-fixed">
							  <SearchPageYandexMap className="search-page-left-block" />
							  {RightBlockContent}
							</div>
						</SearchBlockHeader>
					);
				break;

        case route_names.kROUTE_CATALOG_NEW:
          return (
            <SearchBlockHeader>
              <div ref='main_content' className="search-page-main-fixed search-page-main-fixed--new">
                <svg width="0" height="0" style={{position: 'absolute'}}>
                  <defs>
                    <clipPath id="map-icon-clip-mask">
                      <path d="M21.9989169,0 C9.8492591,0 0,9.37054061 0,20.9297098 C0,32.488879 9.8492591,41.8594196 21.9989169,41.8594196 C22.2241914,41.8594196 22.4472998,41.8507432 22.6725742,41.8442359 L14.9050429,62 L16.5957343,62 C16.5957343,62 37.5190272,40.3453832 42.0786688,29.4955119 C43.3068478,26.8817384 44,23.9838119 44,20.9297098 C44,9.37054061 34.1507409,0 21.9989169,0 Z" id="Path" fill="#000000"></path>
                    </clipPath>
                  </defs>
                </svg>

                <GoogleMapBlockNew style={{backgroundColor: 'blue'}} className="search-page-left-block search-page-left-block--new" />
                <CatalogPageRightBlockContentNew />
              </div>
            </SearchBlockHeader>
          );
        break;        

				//ВСЕ СТРАНИЧКИ С ПОИСКОМ НО БЕЗ КАРТЫ
				case route_names.kROUTE_ACCOUNT:
				//У тебя тут возможно будут другие кейсы	и по итогам будет что то вроде как в блоке выше
				//по итогам смотри блок case стал таким же по структуре что и блок выше
				//код стал читаемей
					var menu_list = [
						{name: 'Компания', id:'company'},
						{name: 'Услуги', id:'services'},
						//{name: 'Статистика', id:'statistics'},
						{name: 'Управление товарами', id:'manage'},
						//{name: 'История оплат', id:'history'}
					];


					var CentralBlockContent = (function(router_state, router_context_params) {
            console.log(router_context_params);
            switch(router_context_params.section) {
              case 'company':
                return <AccountInfo />;
                break;
              case 'services':
                return <AccountServices />;
                break;
              case 'manage':
              	return <AccountManage />;
              break;
              case 'manage-history':
                return <AccountManageHistory />;
                break;
              case 'statistics':
                return <AccountStatistics />;
              break;
            }
					}) (router_state, router_context_params);

					return (
						<SearchBlockHeader>
							<div className='account-container-wrapper'>
								<h1 className='fs29 m5-0'>Личный кабинет</h1>
								<Menu selected={router_context_params.section} className="account-menu" listClassName="ap-link bb-s bold-fixed" items={ menu_list } />
								<hr className='hr100' />
								<div className='account-container'>
									{CentralBlockContent}
								</div>
							</div>
						</SearchBlockHeader>
					);
				break;
        case route_names.kROUTE_COMPANY:
          return (
            <SearchBlockHeader>
              <div className='account-container-wrapper'>
                <div className='account-container'>
                  <CompanyInfo />
                </div>
              </div>
            </SearchBlockHeader>
          );
          break;



				case route_names.kROUTE_TEST_N:
					return (<PriceListSelectionBlock/>);
				break;



			}
		}) (this.state.router_state,this.state.router_context_params.toJS());
		return (
			<div className="main-wrapper">
				<Header />
				<div className="hfm-wrapper main-body">
					{MainContent}
				</div>
				<Footer />
			</div>
	  );
	}
});

module.exports = ice_main;
