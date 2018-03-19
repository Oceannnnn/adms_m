var baseUrl = "http://192.168.22.189:8080/";

//定义高度
var win_g = $(window).height();
var win_h = (win_g - $('.login-con').outerHeight()) * 0.30 + 'px';
var win_w = $(window).width();
var con_wa = $('.am-tabs-bd').width();
var con_ha = $('.am-tabs-bd').height();
$('.frosted-glass,.login').width(win_w);
$('.frosted-glass,.login').height(win_g);
$('.popup_menu').height(win_g);
$('.am-scrollable-horizontal,tbody').css('max-height', win_g - 150 + 'px');
$('.am-tabs-bd').height((win_g - 105) + "px");
$('#main, #main-line, #main-pie').css({
	width: $(".chart").width() + "px",
	height: $(".chart").height() - 50 + "px"
});
$(window).resize(function() {
	win_g = $(window).height();
	win_h = (win_g - $('.login-con').outerHeight()) * 0.30 + 'px';
	win_w = $(window).width();
	con_wa = $('.am-tabs-bd').width();
	con_ha = $('.am-tabs-bd').height();
	$('.frosted-glass,.login').width(win_w);
	$('.frosted-glass,.login').height(win_g);
	$('.popup_menu').height(win_g);
	$('.am-scrollable-horizontal,tbody').css('max-height', win_g - 150 + 'px');
	$('.am-tabs-bd').height((win_g - 105) + "px");
	$('#main, #main-line, #main-pie').css({
		width: $(".chart").width() + "px",
		height: $(".chart").height() - 50 + "px"
	});
})
//选择数据
var my_start, my_end, collect_sel, Select, s_str, e_str, s_year, e_year, s_month, e_month, table_tit, s2 = null;

function choose() {
	my_start = $('input#my-start').val();
	my_end = $('input#my-end').val();
	collect_sel = $('#collect-sel').val();
	Select = $('#select1').val();
	s2 = $('#select2').val();
	s_str = my_start.split('-');
	e_str = my_end.split('-');
	s_year = s_str[0];
	e_year = e_str[0];
	s_month = parseInt(s_str[1]);
	e_month = parseInt(e_str[1]);
	table_tit = my_start + '至' + my_end + '投放汇总 ';
	$('#table_title').text(table_tit);
	if(s_year == e_year && s_month == e_month) {
		table_tit = s_year + '年' + s_month + '月投放汇总 ';
	} else if(s_year == e_year) {
		table_tit = s_year + '年' + s_month + '-' + e_month + '月投放汇总 ';
	} else if(s_year !== e_year && s_month == e_month) {
		table_tit = my_start + '至' + my_end + '投放汇总 ';
	}
	$('#table_title').text(table_tit);
}

//添加数据拼接

function items() {
	var key = [];
	if($("#add_data input[type='checkbox']:checked").length > 0) {
		$('#Table_data table tr').html('');
		$('#Table_data table tbody').html('');
	}
	$("#add_data input[type='checkbox']:checked").each(function() {
		key.push($(this).val());
	});
	var defaultitems = ["guest", "media", "profit", "profitRate"];
	return key.length > 0 ? defaultitems.concat(key) : defaultitems;
}
//分页
function slice(cur, size, total, data) {
	var temp = {};
	for(var key in data) {
		if(size * cur > total) {
			temp[key] = data[key].slice(size * (cur - 1));
		} else {
			temp[key] = data[key].slice(size * (cur - 1), size * cur);
		}
	}
	return temp;
}
//表格请求
var cur = 1;
var totalData;
var itemsArray = [];

function table() {
	var th = '<th>媒体类型</th>';
	th += '<th>' + $('#s_2 .am-selected-status').text().substr(1,2) + '</th>'
	for(var i = 1; i < itemsArray.length; i++) {
		var val = itemsArray[i];
		th += '<th>' + transform(val).name + '</th>';
	}
	$('#Table_data thead tr').html(th);
	tbodydata(itemsArray)

	//设定thead宽度
	var td_anchor = $('tbody tr').eq(0).find('td');
	$.each(td_anchor, function(index) {
		var tdw = $('tbody tr td').eq(index).width();
		$('thead tr th').eq(index).width(tdw)
	});
}

//tbody
function tbodydata(itemsArray) {
	var Json = slice(cur, 20, totalData.item.length, totalData);
	var tbody = $('#Table_data table tbody');
	var o_td = $('#s_1 .am-selected-status').text();
	if(o_td == '平面') {
		o_td = $('#select_2 .am-selected-status').text();
	}
	var str;
	var tds = '<td>' + o_td + '</td>';
	for(var i = 0; i < Json.item.length; i++) {
		str += "<tr>";
		str += tds;
		for(var j = 0; j < itemsArray.length; j++) {
			str += "<td>" + Json[itemsArray[j]][i] + "</td>"
		}
		str += "</tr>";
	}
	tbody.append(str);
}

//滚动加载
function scrollhandler() {
	var zchild = $('#Table_data tbody tr');
	var last_H = zchild[zchild.length - 1].offsetTop; // 	最后距离顶部的高度
	var scrolltop = $('#Table_data tbody').scrollTop(); //	得到滚动条的高度  
	var dang_H = $('#Table_data tbody').height();
	if(dang_H >= last_H - scrolltop) { //当dang_H  大于等于 last_H-scrolltop的高度  就需要加载新的数据了
		cur++;
		if(cur > (Math.ceil(totalData.item.length / 20))) {
			$('#my-prompt').modal({});
			$('#Table_data tbody').unbind("scroll");
			return;
		}
		tbodydata(itemsArray);
	}
}

//图表悬浮按钮
var toggle = $('#ss_toggle');
var menu = $('#ss_menu');
var rot;
$('#ss_toggle').on('click', function() {
	rot = parseInt($(this).data('rot')) - 180;
	menu.css('transform', 'rotate(' + rot + 'deg)');
	menu.css('webkitTransform', 'rotate(' + rot + 'deg)');
	if(rot / 180 % 2 == 0) {
		toggle.parent().addClass('ss_active');
		$('#ss_menu div').addClass('ss_div_animate');
		toggle.addClass('close');
	} else {
		toggle.parent().removeClass('ss_active');
		$('#ss_menu div').removeClass('ss_div_animate');
		toggle.removeClass('close');
	}
	$(this).data('rot', rot);
});
menu.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
	if(rot / 180 % 2 == 0) {
		$('#ss_menu div i').addClass('ss_animate');
	} else {
		$('#ss_menu div i').removeClass('ss_animate');
	}
});

//表头显示
function transform(key) {
	var obj = {};
	switch(key) {
		case 'guest':
			obj.name = "客户排期金额";
			obj.unit = "万元"
			break;
		case 'media':
			obj.name = "媒体排期金额";
			obj.unit = "万元"
			break;
		case 'profit':
			obj.name = "利润";
			obj.unit = "万元啊"
			break;
		case 'profitRate':
			obj.name = "利润率";
			obj.unit = "万元g啊"
			break;
		case 'item1':
			obj.name = "排期金额";
			obj.unit = "万元"
			break;
		case 'media1':
			obj.name = "排期金额啊";
			obj.unit = "万元啊"
			break;
		case 'item2':
			obj.name = "排期金额g啊";
			obj.unit = "万元g啊"
			break;
		case 'media2':
			obj.name = "利润率f";
			obj.unit = "万元g啊"
			break;
		case 'profit2':
			obj.name = "排期f金额";
			obj.unit = "万元"
			break;
		case 'profitRate2':
			obj.name = "排期金f额啊";
			obj.unit = "万元啊"
			break;
		case 'item12':
			obj.name = "排期金f额g啊";
			obj.unit = "万元gf啊"
			break;
		case 'media12':
			obj.name = "排期金f额g啊";
			obj.unit = "万元g啊"
			break;
		default:
	}
	return obj;
}
//  选择媒体类型 
var  Selectarr  = {
	'NEWSPAPER': '报纸',
	'MAGAZINE': '杂志',
	'ALL': '全部'
};     
$('#select1').on('change', function() {
	var  val  =  $(this).val();
	var  html  =  '';       
	for(var  e in Selectarr) {  
		if(Selectarr.hasOwnProperty(e)) {
			html  +=  '<option value="' + e + '">' + Selectarr[e] + '</option>'; 
		}            
	}             
	if(val == 'PAPER') {
		$('#select_2').css('display', 'inline-block')
	} else {
		$('#select_2').css('display', 'none')
	}            
	$('#select2').html(html);        
});