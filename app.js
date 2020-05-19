require.config({
	paths: {
		handlebars: "lib/handlebars",
		text: "lib/text",
		hbs: "lib/hbs"
	},
	shim: {
		handlebars: {
			exports: "Handlebars"
		}
	}
});

define('app', ['lib/router', 'lib/utils'], function(Router, Utils) {
	Router.init();
	var myApp = new Framework7({
		swipePanel: true,
		tapHold: true,
		cache: true,
		modalButtonOk: '确定',
		modalButtonCancel: '取消',

	});
	var mainView = myApp.addView('#mianview', {
		domCache: true,
	});

	var $$ = Dom7;


	var tenantId = '';
    var qId = 0;
	var memo = '请选择事项';
	var selectMemo = false;
    var marterId = 0;
    var matter = '';
    var operatingUser = 0;
  	var basePath =  'http://180.142.130.246:9010/admin/';
	
	/**
	 * ajax请求
	 * @param {Object} _url url
	 * @param {Object} _data 参数对象
	 * @param {Object} _callback 成功回调
	 */
	var ajaxLoadPageContent = function(_url, _data, _callback, _options) {
		var options = $.extend({
				async: true,
				type: 'GET',
			},
			_options);
		myApp.showPreloader('加载中...');
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			success: function(data) {
				if(_callback) _callback(data);
				//后来加的
				myApp.hidePreloader();
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};
	/*
	 * ajax请求
	 */
	var ajaxLoadPageContent1 = function(_url, _data, _callback, _options) {
		var options = $.extend({
				async: true,
				type: 'GET',
			},
			_options);
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			success: function(data) {
				if(_callback) _callback(data);
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};


	/*
	 * ajax请求
	 */
	var ajaxWithHeader = function(_url, _data,headers, _callback, _options) {
		var options = $.extend({
				async: true,
				type: 'POST',
			},
			_options);
		$$.ajax({
			url: _url,
			method: options.type,
			dataType: 'json',
			async: options.async,
			data: _data,
			headers:headers,
			success: function(data) {
				if(_callback) _callback(data);
			},
			error: function() {
				myApp.alert(Utils.callbackAjaxError());
			}
		});
	};

	return {
		myApp: myApp,
		basePath: basePath,
		mainView: mainView,
		ajaxLoadPageContent: ajaxLoadPageContent,
		ajaxLoadPageContent1:ajaxLoadPageContent1,
		ajaxWithHeader:ajaxWithHeader,
		tenantId:tenantId,
		qId : qId,
		marterId: marterId,
		matter: matter,
		operatingUser: operatingUser,
		selectMemo: selectMemo,
		memo: memo
		
	};
});