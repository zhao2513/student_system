
var tableData = [];


var editForm = document.getElementById('edit-form');
var addFormDatas = document.getElementById('student-add-form');
//添加后的表单属性
var addFormData = getFormData(addFormDatas);
var pageIndex = 1;//当前页数
var prePage = document.getElementsByClassName('pre-page')[0];
var nextPage = document.getElementsByClassName('next-page')[0];
var allCount = 1;//初始化页面总数
var pageSize = 2;//页面数量

var searchForm = document.getElementsByClassName('search-form')[0];
var searchContent = document.getElementsByClassName('search-content')[0];
var searchBtn = document.getElementsByClassName('search-btn')[0];
var searchSex = -1;

//事件处理：
//点击按钮转换
function bindEvent(){
	var oDl = document.getElementsByClassName('menu')[0];
	//背景块
	var modal = document.getElementsByClassName('modal')[0];
	//index对应学生信息索引
	var index = 0;
	oDl.onclick = function(e){
		var event = e || event;
		var target = event.target || event.srcElement;
		 if(target.tagName != 'DD'){
		 	return false;
		 }
		 for(var i = 0; i < this.children.length; i++){
		 	this.children[i].classList.remove('active-list');
		 }
		 target.classList.add('active-list');
		 var id = target.dataset.id;
		 var contentBox = document.getElementsByClassName('content-box');
		 for(var i = 0; i< contentBox.length;i++){
		 	contentBox[i].style.display = "none";
		 }
		 document.getElementById(id).style.display = 'block';
	}

	//3.向服务器添加表单信息
	var addStudents = document.getElementById('addStudents');
	addStudents.onclick = function(e) {
		// 阻止默认行为  提交按钮的默认行为是刷新整个页面
		var event = e|| event;
		event.preventDefault();
		//向服务器添加数据API
		var resetForm = document.getElementById('reset-form');
		addFormData = getFormData(addFormDatas);
		console.log(addFormData)
		renderSaveData('addStudent', addFormData,function(){
			var dd = oDl.getElementsByTagName('dd')[0];
			getData('findByPage');
			dd.click();
			resetForm.click();
		});
	}
		
	//6.表单编辑
	var studentTable = document.getElementById('student-table');
	studentTable.onclick =function(e){
		var event = event || e;
		var target = event.target || event.srcElement;
		if(target.tagName != 'BUTTON'){
			return false;
		}
		var flat = target.classList.contains('edit');
		index = target.dataset.index;
		if(flat){
			modal.style.display = 'block';
			renderEditForm(tableData[index])
		}else{
			var key = window.confirm('你确定要删除这个傻逼吗');
			if(key){
				renderSaveData('delBySno',{sNo:tableData[index].sNo},function(data){
						alert(data.msg);
						modal.style.display = 'none';
						getData();
				})
			}
		}
	}

	//7.编辑确认按钮
	var btnEdit = document.getElementsByClassName('btn-edit')[0];
	btnEdit.onclick = function (e){
		e.preventDefault();
		//获取回填后的编辑表单数据
		var editFormData = getFormData(editForm);
		 renderSaveData('updateStudent',editFormData,function(data){
		 	modal.style.display = 'none';
			getData('findByPage');
		 })
	    

	}
	//8.背景modal
	var modal = document.getElementsByClassName('modal')[0];
	var modalContent = modal.getElementsByClassName('modal-content')[0];
	modal.onclick = function(e){
		this.style.display = 'none';
	}
	modalContent.onclick = function(e){
		var event = e || event;
		//阻止事件冒泡
		event.cancelBubble = true;
	}		
	
	//10.上下页点击
	prePage.onclick = function(e){
		pageIndex--;
		if(pageIndex < 1){
 		pageIndex = 1;
 	}
 		getDateBtn();	
	}
	nextPage.onclick = function(){
		pageIndex++;
		if(pageIndex > allCount){
 		pageIndex = allCount;
 	}
		getDateBtn();
	}
	//搜索框聚焦
	searchContent.onblur = function(){
		
	}
	searchContent.onfocus = function(){
		if(this.value == '请输入搜索内容'){
			this.value = '';
		}
	}
	//搜索确认按钮
	searchBtn.onclick = function(e){
		e.preventDefault();
		searchVlaue = searchForm.search.value;
		searchSex = searchForm.sex.value;
		getDateBtn();
		
	}
}

//2.获取表单填写信息
function getFormData (form){
	if(!form)return false;	
	console.log(form);
	var sNo = form.sNo.value;
	var name = form.name.value;
	var email = form.email.value;
	var sex = form.sex.value||'0';
	var birth = form.birth.value;
	var phone = form.phone.value;
	var address = form.address.value;
	console.log(sNo,name)
	return {
		sNo,
		name,
		email,
		sex,
		birth,
		phone,
		address
	}

}

//4.向服务器获取表单信息 => 顺带渲染数据
function getData(url,cb){//判断是否为搜索接口
	var obj = url == 'findByPage' ? {} : {search:searchVlaue,sex:searchSex};
	console.log(url,obj)
 	renderSaveData(url,obj,function(datas){
 		cb && cb(datas);//添加回调函数
 		//总页数 
 		allCount = Math.ceil(datas.data.cont/pageSize);
 		tableData = datas.data.findByPage || [];
 		//渲染表格
		renderForm(datas);
 	})
 	
}
getData('findByPage');

//5.渲染表单=>表单模板=>字符串模板
function renderForm(retData){
	console.log(pageIndex,'1');
	//学生列表主体信息
	var studentTbody = document.getElementById('student-tbody');
	if(retData.msg != 'fail'){
		var data = retData.data.findByPage || retData.data.searchList;
		studentTbody.innerHTML = "";
		for(var i = 0;i<data.length;i++){
			var str = `<tr>
		                    <td>${data[i].sNo}</td>
		                    <td>${data[i].name}</td>
		                    <td>${data[i].sex == '0'?'男':'女'}</td>
		                    <td>${data[i].email}</td>
		                    <td>${new Date().getFullYear() - data[i].birth}</td>
		                    <td>${data[i].phone}</td>
		                    <td>${data[i].address}</td>
		                    <td>
		                        <button class="btn edit" data-index="${i}">编辑</button>
		                        <button class="btn delete" data-index="${i}">删除</button>
		                    </td>
		                </tr>`;
		    studentTbody.innerHTML += str;
		}
			
	}else{
		alert(retData.msg||'数据库有误')
	}
}
//7.表单数据回填 =>编辑按钮
function renderEditForm(data){
	for(var name in addFormData){
		console.log(editForm[name],data[name])
		editForm[name].value = data[name];
	}
}

bindEvent();

//8.减少代码冗余，优化代码
function renderSaveData(url,obj,callback){
	var urls = 'http://open.duyiedu.com/api/student/' + url;
	var objs = Object.assign({
		appkey: 'dongmeiqi_1547441744650',
		page:pageIndex,
		size:pageSize
	},obj)
	console.log(urls,objs)
	var result = saveData(urls,objs);
	console.log(result)
	if(result.status == 'fail'){
		alert(result.msg);
	}else{
		callback && callback(result);
	}
}

//10.减少代码冗余
function getDateBtn(){
	if(searchContent.value == '请输入搜索内容'){
		getData('findByPage');
	}else{
		getData('searchStudent')
	}
}




// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object'){
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}