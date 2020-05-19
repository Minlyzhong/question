define(['app',
  'hbs!js/hbs/satisfy',
  'hbs!js/hbs/operatingUserQuest'
],function(app,template, operatingTem){
  var $$ = Dom7;

  var personDetail = app.basePath + '/mobile/window/getOneById';
  var savePath = app.basePath + 'mobile/window';

  var SatisfactionList = [{score:0, val:'很满意'}, {score:1, val:'满意'}, {score:2, val:'一般'}, {score:3, val:'不满意'}, {score:4, val:'差'}, ];
  var qId = 0;
  var remarks = '';
  var score = 0;
  var applicant = '';
  var isChoose = false;
	var applyCompany = '';
  var typeVal = '';
  var chooseLogType = 0;
  var operator = 0;
  var isoperatorChoose = false;

  function init(page) {

    console.log("init....");
    initData(page.query);
    ajaxLoadContent(page.query);
    clickEvent(page);
   
  }
  
  function initData(query) {
    qId = 0;
    isChoose = false;
    remarks = '';
    applicant = '';
    score = 0;
    applyCompany = '';
    chooseLogType = 1;
    operator = 0;
    isoperatorChoose = false;
    $$('.Satisfaction').html(template(SatisfactionList));

  }

  /**
	 * 点击事件
	 */
	function clickEvent(page) {
		
		$$('.submit').on('click', submitContent);
		$$('.scoreF').on('click', setScore);
		
		
  }
  
   /**
	 * 提交
	 */
  function submitContent(){

    applicant = $$('#applicant').val();
		applyCompany = $$('#applyCompany').val();
    remarks = $$('#newsContent').val();
   
    typeVal = $$('#recordType').val();
    console.log(typeVal);

    if(app.selectMemo == false){
      app.myApp.alert('请选择您所办理的事项', '系统提示');
      return;
    }else if(isChoose == false){
      app.myApp.alert('请对此次的服务进行评分', '系统提示');
      return;
    }else if(isoperatorChoose == false){
      app.myApp.alert('请选择办事员', '系统提示');
      return;
    }else if(applicant == ''|| applicant == null){
      app.myApp.alert('请填写填报人名称', '系统提示');
      return;
    }else{
      app.myApp.confirm('是否确认提交?','系统提示', function() {
        
        var formData={
          winId: qId,
          matId: app.marterId,
          operatingUser: operator,
          scoreType: score,
          rater: applicant,
          memo: remarks,
          tenantId: app.tenantId,
					applyCompany: applyCompany
        }
        console.log(formData);
           
        var formDatas= JSON.stringify(formData)
        
            // 提交到后台审核
            $$.ajax({
                url:savePath,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset:utf-8', 
                data: formDatas,
                cache: false,
                success:function (data) {
            
                  if(data.data == true && data.code == 0){  
                    $$('#applicant').val('');
                    $$('#newsContent').val('');
										$$('#applyCompany').val('');
                    app.myApp.getCurrentView().loadPage('result.html');
                  }else{
              
                    app.myApp.alert(data.msg, '系统提示');
                    
                  }
                  
                },
                error:function () {
                    app.myApp.alert("网络异常！", '系统提示');
                  
                    
                }
            });
      });
      
    }
    
    
   
	}



//获取url参数
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;

}

  function setScore(){
    score = $$(this).data('score');
    console.log(score)
    $$('.Satisfaction li').removeClass('select');
    $$(this).addClass('select');
    isChoose = true;
  }

  
  
  function ajaxLoadContent(data) {
    qId = GetQueryString('id');
    console.log(qId);
    if(qId){
      app.qId = qId;
      app.ajaxLoadPageContent(personDetail,{
        id: qId
      },function(result){
        var detail = result.data;
        console.log(detail);
        if(result.msg == '成功' && result.data != null){
          app.tenantId = detail.tenantId;
         
          $$('.headerTitle').html(detail.winName+'服务满意度评分');

          console.log(detail.operatingPeopleList);

          var operatings = detail.operatingPeopleList;
          
          $$('.operatorList').html(operatingTem(operatings));
          if(operatings.length == 1){
            isoperatorChoose = true;
            $$('.operator').addClass('select');
            operator = operatings[0].userId;
          }

          $$('.operator').on('click', setOperator);

          function setOperator(){
            console.log('111');
            operator = $$(this).data('userId');
            console.log(operator);
            $$('.operatorList li').removeClass('select');
            $$(this).addClass('select');
            isoperatorChoose = true;
          }

        }else{
          app.myApp.alert("没有对应的信息", '系统提示');
        }

      })
    }
  }



  
  
  return {
    init:init
  }
});