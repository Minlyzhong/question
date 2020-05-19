define(['app','hbs!js/hbs/partyListQuest'], function(app,template) {
	var $$ = Dom7;
	var firstIn = 1;
	//模糊查询新闻
	var findSearchNewsPath = app.basePath + '/mobile/window/list';
	var pageNo = 1;
	var loading = true;
	var newsKey = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		attrDefine(page);
		
		clickEvent(page);
		pushAndPull(page);
		findSearchNews(false);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		pageNo = 1;
		loading = true;
		newsKey = '';
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('#ShowNewsSearch').on('focus',searchRecord);
		$$('.ShowNewsSearchBar .searchCancelBtn').on('click', hideSearchList);
		$$('#ShowNewsSearch').on('keyup', keyupContent);
	}
	
	function searchRecord(){
		pageNo = 1;
		loading = true;
		newsKey='';
		$$(this).css('text-align', 'left');
		//$$('.searchNews').html('');
		$$('.newsNotFound').css('display', 'none');
		$$('.ShowNewsSearchBar .searchCancelBtn').css('display', 'block');
	}
	function hideSearchList(){
		pageNo = 1;
		loading = true;
		newsKey='';
		$$('#ShowNewsSearch').val('');
		$$('.newsNotFound').css('display', 'none');
		$$('.newsList').html('');
		$$('#ShowNewsSearch').css('text-align', 'center');
		$$('.ShowNewsSearchBar .searchCancelBtn').css('display', 'none');
		findSearchNews(false);
	}
	function keyupContent(){
		//$$('.searchNews').html('');
		$$('.newsList').html('');
		newsKey = $$('#ShowNewsSearch').val();
		console.log(newsKey);
		if(!newsKey) {
			return;
		}
		findSearchNews(false);
	}
	
	
	//模糊查询新闻
	function findSearchNews(isLoadMore){
		app.ajaxLoadPageContent1(findSearchNewsPath, {
			query: newsKey,
			current: pageNo,
			size: 20,
			winId: app.qId,
			tenantId: app.tenantId,
		}, function(result) {
			var data = result.data.records;
			console.log(data);
			//确定没有信息并且是第一页的时候
			console.log(data.length == 0);
			if(data.length == 0 && pageNo == 1){
				$$('.newsNotFound').css('display','block');
				
				$$('.newsList').html(template());
			}else if(data.length == 0 && pageNo !== 1){
				app.myApp.alert('已没有更多内容', '系统提示');
			}else{
				handlePartyGetList(data, isLoadMore);
			}
		});
	}
	
		/**
	 * 加载文章列表
	 * @param {Object} data 数据
	 * @param {Object} isLoadMore 是否加载更多
	 */
	function handlePartyGetList(data, isLoadMore) {
		if(data && data.length > 0) {
			var partyData = data;
			$$('.headerTitle').html(data[0].winName);
			if(isLoadMore == true) {
				$$('.newsList').append(template(partyData));
			} else {
				$$('.newsList').html(template(partyData));
			}
			//点击文章事件
			$$('.memoContent').on('click', partyContentHandle);

			loading = false;
		} else {

		}
	}
	
	//文章列表的点击事件
	function partyContentHandle() {

		app.marter = $$(this).data('marter');
		app.marterId = $$(this).data('marterId');
		console.log(app.marterId)
		console.log(app.marter)
		$$('#memoName').html(app.marter);
		
		app.selectMemo = true;
		app.myApp.getCurrentView().back();
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				findSearchNews(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			findSearchNews(true);
		});
	}


	return {
		init: init
	}
});