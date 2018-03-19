$(function() {
	//储存login填写的真实姓名
	var isLogin = sessionStorage.getItem('username');
	$('#head-user').text(isLogin); //将姓名写入#head-user

	if(isLogin === '' || isLogin === null) {
		window.location.href = "login.html";
	}
	//日期选择
	$(".am-datepicker").css({
		"left": "50%",
		"width": "80%",
		"transform": "translateX(12%)"
	});
	var $alert = $('#my-alert');
	var startDate = $('#my-start').val();
	var endDate = $('#my-end').val();
	$('.am-datepicker:first .am-datepicker-month').click(function() {
		$('.am-datepicker:first').hide();
		setTimeout(function() {
			if($('.am-datepicker:first').is(":hidden")) {
				startDate = $('#my-start').val();
				if(startDate > endDate) {
					$alert.find('p').text('开始日期应小于结束日期！').end().show();
					$('#click_create,#click_mark').addClass("am-disabled");
				} else {
					$alert.hide();
					$('#click_create,#click_mark').removeClass("am-disabled");
				}
			}
		}, 300);
	});
	$('.am-datepicker:last-child .am-datepicker-month').click(function() {
		$('.am-datepicker:last-child').hide();
		setTimeout(function() {
			if($('.am-datepicker:last-child').is(":hidden")) {
				endDate = $('#my-end').val();
				if(startDate > endDate) {
					$alert.find('p').text('结束日期应大于开始日期！').end().show();
					$('#click_create,#click_mark').addClass("am-disabled");
				} else {
					$alert.hide();
					$('#click_create,#click_mark').removeClass("am-disabled");
				}
			}
		}, 300);
	});

	  

	 
	//退出登录
	$('#signOut').click(function() {
		window.location.href = "login.html";
	});
	//侧边栏
	$('li.am-panel').click(function() {
		$('li.am-panel.on').removeClass('on')
	});
	$('#btn-s').click(function() {
		$('li.am-panel:first').addClass('on')
	});
	$('#col').click(function() {
		$('#sidebar').offCanvas('close');
		$('#main-body').show('close');
		$('#main-revise').hide('close');
	});
	$('#btn-s').click(function() {
		$('#li.am-panel a.a-head').click();
	});
	//列表切换
	$('#list-tabs,#chart-tabs').tabs({
		noSwipe: 1
	});
	//筛选按钮
	$('#filter').click(function() {
		$('.popup_menu.pr').show();
		$('.am-header-left').dropdown('close');
	});
	//取消
	$('#click_cancel').click(function() {
		$('.popup_menu').hide();
	});
	//选择其他数据确认
	$('#add-screen').click(function() {
		$('#add-modal').show();
		$('.am-header-left').dropdown('close')
	});
	//取消添加数据
	$('#btn-close').click(function() {
		$('#add-modal').hide();
	});
	//模态框
	$.AMUI.progress.configure({
		parent: '.am-tabs-bd'
	});
	//侧栏菜单点击
	$('.slider-item').click(function() {
		$('.slider-item').removeClass('active');
		$(this).addClass("active");
	});
	$(document).click(function() {
		if($("#add_data input[type='checkbox']:checked").length > 0) {
			$('#btn-confirm').removeClass('am-disabled');
		} else {
			$('#btn-confirm').addClass('am-disabled');
		}
	})
	//  第一次生成
	$('#click_create').click(function() {
		$.AMUI.progress.start();
		$('.popup_menu').css('display', 'none');
		$('#click_create').css('display', 'none');
		$('.clcik_confirm').css('display', 'block');
		filter();
		addition();
	})
	//	第二次筛选确认
	$('#click_mark').click(function() {
		$.AMUI.progress.start();
		$('.popup_menu').css('display', 'none');
		filter();
		addition();
	})
	//  添加数据确认
	$('#btn-confirm').click(function() {
		$.AMUI.progress.start();
		$('#add-modal').css('display', 'none');
		filter()
	});
	//  图表切换
	$('#bar').click(function() {
		$('#main').show().siblings('div').hide();
		$('#ss_toggle').click();
		if(!barChart.isDisposed()){
			barChart = bar();
		}
	})
	$('#line').click(function() {
		$('#main-line').show().siblings('div').hide();
		$('#ss_toggle').click();
		if(!lineChart.isDisposed()){
			lineChart = line();
		}
	})
	$('#pie').click(function() {
		$('#main-pie').show().siblings('div').hide();
		$('#ss_toggle').click();
		if(!pieChart.isDisposed()){
			pieChart = pie();
		}
	})

	//重置密码
	$('#btn-revise').click(function() {
		$('#main-revise').show();
		$('#main-body').hide();
		$('#sidebar').offCanvas('close');
	});
	$('#reset-pass').click(function() {
		$('#main-revise').hide();
		$('#main-body').show();
		$('#sidebar').offCanvas('close');
		$('.slider-item').removeClass('active');
		$('.slider-item').eq(0).addClass('active');
	});
	$('.new_pass input').focus(function() {
		$(this).attr("placeholder", "由数字和字母组成，且长度大于8位!");
	});
	$('.new_pass input').blur(function() {
		$(this).attr("placeholder", " ");
	});
	var str = "<span class='pwd-err' style='color:red;display:block;margin-top:1rem;'></span>";
	$('#revise-body').find('#revise-btn').after(str);
	$('#revise-btn').click(function() {
		var old = $('#old_password').val();
		var new_password = $('#new_password').val();
		var c_new_password = $('#c_new_password').val();
		var word_1 = old === '' || new_password === '' || c_new_password === '';
		var data = {
			oldPassword: old,
			newPassword: new_password,
			passwordConfirm: c_new_password
		};
		if(word_1) {
			$('#revise-prompt').modal({});
			$('#revise-prompt .am-modal-hd').text("密码不能为空!")
		} else {
			$('#revise-body .pwd-err').text(' ');
			$.ajax({
				type: "PUT",
				url: baseUrl + "adms/my/password", //'adms/my/password'
				headers: {
					"Content-Type": "application/json"
				},
				data: JSON.stringify(data),
				xhrFields: {
					withCredentials: true
				},
				success: function (res)  {
					$('#revise-prompt').modal('open');
					switch(res.msg) {
						case 'NEW_PASSWORD_MATCH_OLD':
							$('#revise-prompt .am-modal-hd').text("新旧密码一样!")
							break;
						case 'NEW_PASSWORDS_NOT_MATCH':
							$('#revise-prompt .am-modal-hd').text("新密码输入不一致!")
							break;
						case 'OLD_PASSWORD_INCORRECT':
							$('#revise-prompt .am-modal-hd').text("旧密码输入错误!")
							break;
						case 'PASSWORD_NOT_VALID':
							$('#revise-prompt .am-modal-hd').text("新密码需要由数字和字母组成，且长度大于8位!")
							break;
						case 'RESET_SUCCESS':
							$('#revise-prompt .am-modal-hd').text("密码修改成功!")
							setTimeout(function() {
								window.location.href = "login.html";
							}, 1000);
							break;
						default:
							$('#revise-prompt .am-modal-hd').text("出错啦!")
							break;
					}                  
				}
			});
		}
	})
});