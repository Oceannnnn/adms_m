//登录
$('#signBtn').click(function() {
	var userName = $('#userName').val();
	var passWord = $('#passWord').val();
	//1. get the username and password
	if(!(userName === '' || passWord === '')) { 
		$.ajax({             
			type: "post",
			url: baseUrl + "json/2.json", //"adms/login"
			headers: {
				"Content-Type": "application/json"
			},
			data: JSON.stringify({
				"username": userName,
				"password": passWord
			}),
			xhrFields: {
				withCredentials: true
			},
			success: function (res)  {
// 				if(res.roles[0] == "ROLE_SUPERIOR") {
// 					saveUserInfo();
// 					sessionStorage.setItem("username", userName); //将userName存储到username字段
// 					sessionStorage.setItem("password", passWord);                        
// 					window.location.href = "./main.html?vconsole=show"; //如果登录成功则跳到界面
// 				} else {
// 					$('#login-prompt').modal('open');
// 					$('#login-prompt .am-modal-hd').text("您没有权限哦!")
// 				}   
				window.location.href = "./main.html?vconsole=show"; //如果登录成功则跳到界面
			},
			error: function (msg)  {
				window.location.href = "./main.html?vconsole=show"; //如果登录成功则跳到界面
// 					$('#login-prompt').modal('open');
// 				switch(msg.responseJSON) {
// 					case '坏的凭证':
// 						$('#login-prompt .am-modal-hd').text("用户名或密码错误!")
// 						break;
// 					case '用户账号已过期':
// 						$('#login-prompt .am-modal-hd').text("用户账号已经过期!")
// 						break;
// 					case '用户已失效':
// 						$('#login-prompt .am-modal-hd').text("用户已被删除!")
// 						break;
// 					case '用户账号已被锁定':
// 						$('#login-prompt .am-modal-hd').text("用户账号被锁!")
// 						break;
// 					default:
// 						$('#login-prompt .am-modal-hd').text("登陆错误!")
// 						break;
				}
			}
		});
	} else {
		$('#login-prompt').modal('open');
		$('#login-prompt .am-modal-hd').text("账号或密码不能为空!")
	}
});

//记住密码
function saveUserInfo() {
	var userName = $('#userName').val();
	var passWord = $('#passWord').val();
	if($("#rmbUser").prop("checked")) {
		$.cookie("rmbUser", "true", {
			expires: 7
		}); // 存储一个带7天期限的 cookie
		$.cookie("userName", userName, {
			expires: 7
		}); // 存储一个带7天期限的 cookie
		$.cookie("passWord", passWord, {
			expires: 7
		}); // 存储一个带7天期限的 cookie
	} else {
		$.cookie("rmbUser", "false", {
			expires: -1
		}); // 删除 cookie
		$.cookie("userName", '', {
			expires: -1
		});
		$.cookie("passWord", '', {
			expires: -1
		});
	}
}

//记住用户名和密码
if($.cookie("rmbUser")) {
	$("#rmbUser").attr("checked", true);
	$("#userName").val($.cookie("userName"));
	$("#passWord").val($.cookie("passWord"));
}
