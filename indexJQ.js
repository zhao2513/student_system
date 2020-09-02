
var nowPage = 1 ;
var pageSize = 4 ;
var allPage = 1;
var tableData = [];
var tableName ={};
function bindEvent(){
	//1. 点击切换
	$(".menu").on('click','dd',function(e){
		e.preventDefault();
		$('.menu > dd').removeClass('active-list');
		$(this).addClass('active-list');

		console.log($(this).data('id'));

		$('.content-box').hide();
		var id = $(this).data('id');
		$("."+id).show();
	})

	//2. 添加表单提交
	$('#addStudents').click(function(e){
		e.preventDefault();
		var data = $('#student-add-form').serializeArray();
		var dataObj = filterData(data);
		if(dataObj.status == 'fail'){
			alert(dataObj.msg);
		}else{
			getData('addStudent',dataObj.data,function(res){
				//跳转表单页面
				$('.menu > dd[data-id=student-edit]').click();
				renderData();
				$('#reset-form').click();//重置表单
			})
		}
		console.log(dataObj,$('#student-add-form').serializeArray())
	})

	//7. 编辑表单按钮事件
	$("#student-tbody").on('click','.edit',function(e){
		e.preventDefault();
		var i = $(this).parents('tr').index();
		$('.modal').show();
		retTable(tableData[i]);//数据回填
		
		
	}).on('click','.delete',function(e){
		var i = $(this).parents('tr').index();
		var delKey = window.confirm('你确定要删除这傻逼吗？')
		if(delKey){
			console.log(tableData[i])
			getData('delBySno', {sNo:tableData[i].sNo},function(res){
				alert(res.msg);
				getDateBtn();
			})
		}
		
	})

	//8. 编辑后表单确认提交
	$('.btn-edit').click(function(e){
		e.preventDefault();
		var data = $('#edit-form').serializeArray();
		var dataObj = filterData(data);
		if(dataObj.status == 'fail'){
			alert(dataObj.msg);
		}else{
			getData('updateStudent',dataObj.data,function(res){
				alert(res.msg);
				$('.modal').click();
				renderData();
			})
		}
	})

	//9. 点击编辑块隐藏
	$('.modal').click(function(e){
		if(e.target == this){
			$(this).hide();
		}
	})

	//12. 搜索按钮
	$('.search-btn').click(function(e){
		clearInterval(timer);
		e.preventDefault();
		getDateBtn();
	})

	//13. 搜索框聚焦
	var timer = null;
	$('.search-content').on('blur',function(){
		if(this.value == ''){
			this.value = '请输入搜索内容';
		}
	}).on('focus',function(){
		if(this.value == '请输入搜索内容'){
			this.value = '';
		}
	}).on('input',function(){//14. 输入+防抖
		clearInterval(timer);
		timer = setInterval(function(){
			$('.search-btn').click();
		},500)
	})

	

}
bindEvent();

//3. 过滤数据
function filterData(data){
	var obj = {
		status:'success',
		data:{},
		msg:''
	};

	for(var i = 0 ;i < data.length; i++){
		var dataIndex = data[i];
		if(dataIndex.value || dataIndex.value === '0'){
				obj.data[dataIndex.name] = dataIndex.value;
		}else{
			obj.msg = '填写信息不全';
			obj.status = 'fail'	
		}
		
	}
	tableName = obj[data];
	return obj;
}

//4. 发送请求
function getData(url,obj,cb){
	$.ajax({
		url:'http://open.duyiedu.com/api/student/'+url,
		method:'get',
		data:$.extend({
			appkey: 'zhao2513_1581078586577'
			
		},obj),
		dataType:'json',
		success:function(res){
			if(res.status == 'success'){
				cb &&  cb(res);
			}else{
				alert(res.msg)
			}
			
		},
		error:function(err){
			alert(err)
		}
	})
}

//5. 获取分页数据
function renderData(){
	getData('findByPage' , {page:nowPage,size:pageSize} , function(res){
		allPage = Math.ceil(res.data.cont/pageSize);
		var data = res.data.findByPage;

		tableData = data;
		renderDOM(data);
	})	
}
renderData();

//6. 渲染DOM
function renderDOM(data){
	if(data){
		//渲染列表
		var str = '';
		for(var i = 0; i<data.length; i++){
			str += `<tr>
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
		}
		$('#student-tbody').html(str);
	}
		

	//10. 渲染分页
	$('.page-div').page({
		page:nowPage,
		num:allPage,
		getPageIndex :function(changePage){
			nowPage = changePage;
			renderData();
		}
	})
		
}

//8. 表单回填:交集 =>data里面有的属性，如果编辑表单存在有则回填
function retTable(data){
	
	var editForm = $('#edit-form')[0];
	console.log(data,editForm);
	for(var name in data){

	if (editForm[name]) {
			editForm[name].value = data[name]
		}
	}
}

//11. 获取搜索数据
//其实可以和第五步合并,在原生上，便把两个接口合并了
function getSearchData(){
	var searchValue = $('.search-content')[0].value;
	getData('searchStudent',{
		sex:parseInt($('.search-form')[0].sex.value),
		page:nowPage,
		size:pageSize,
		search: searchValue == '请输入搜索内容' ? '': searchValue
	},function(res){
		
		allPage = Math.ceil(res.data.cont/pageSize);
		
		var data = res.data.searchList;
		tableData = data;
		renderDOM(data);
	})
}

//13. 减少代码冗余，判断搜索框是否有内容
function getDateBtn(){
	console.log($('.search-content')[0].value )
	if($('.search-content')[0].value == '请输入搜索内容'){
		renderData();
	}else{
		getSearchData();
	}
}