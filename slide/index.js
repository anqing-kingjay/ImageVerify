//@param selector触发按钮
//@param options 配置项
function SliderVerification(selector, options) {
	this.box = $(selector); //传入的盒子
    options = options || {};

    this.buttonWidth = options.width || '240'; //触发按钮的宽度
    this.buttonHeight = options.height || '50'; //触发按钮的高度

	//线上环境
	// this.baseURL = 'https://open.baiwang.com/defense';
	//测试环境
	this.baseURL = '/defense';

	this.isShow = false; //是否显示验证页
	this.isSuccess = false; //是否验证成功
	this.isGetData = false; //图片数据是否获取成功
	this.times = 0; //验证次数
    this.successCallback = options.successCallback;
	this.init();
}
//创建验证码页面
SliderVerification.prototype = {
	init: function() {
		this.show();
		this.createDoms();
		this.domEvent();
		if(this.box.length > 0){
		    this.box.append(this.main);
        }else{
		    this.docBody.append(this.main);
        }
		this.getData();
	},
	//构建dom
	createDoms: function() {
	    this.docBody = $(document.body);
		this.main = $('<div  class="Trigger_slider"></div>');
		this.oGuide = $('<div class="validate_oGuide"></div>');
		this.main.append(this.oGuide);
		this.oMain = $('<div  class="validate_main"></div>');
		this.oBig = $('<img  class="validate_big">');
		this.oAll = $('<img  class="validate_all">');
		this.oBlock = $('<img  class="validate_block">');
		this.oTimeBox = $('<div  class="validate_time"></div>');
		this.oLoad = $('<div  class="validate_load">加载中，请稍后</div>');
		this.oMain.append(this.oBig);
		this.oMain.append(this.oBlock);
		this.oMain.append(this.oAll);
		this.oMain.append(this.oTimeBox);
		this.oMain.append(this.oLoad);
		this.main.append(this.oMain);
		this.obox = $('<div class="validate_box"></div>');
		this.prompt = $('<div class="validate_prompt">拖动左边滑块完成上方拼图</div>');
		this.oButton = $('<div class="validate_button"></div>');
		this.oProgress = $('<div class="validate_progress"></div>');
		this.obox.append(this.prompt);
		this.obox.append(this.oButton);
		this.obox.append(this.oProgress);
		this.main.append(this.obox);
		var hr = $('<hr class="validate_underline" />');
		this.main.append(hr);
		var refresh = $('<div class="validate_refresh"></div>');
		this.refreshBox = $('<div class="validate_refresh_box"></div>');
		var refreshContent = $('<div class="validate_refresh_content">刷新</div>');
		this.icon = $('<div class="validate_icon"></div>');
		var content = $('<span class="validate_content">百望云提供技术支持</span>');
		this.refreshBox.append(this.icon);
		this.refreshBox.append(refreshContent);
		refresh.append(this.refreshBox);
		refresh.append(content);
		this.main.append(refresh);
		this.sliderIcon = $('<div class="Trigger_slider_icon"></div>');
		this.sliderLogo = $('<div class="Trigger_slider_logo"></div>');
		this.sliderText = $('<span class="Trigger_slider_text">点击按钮进行验证</span>');
		this.sliderButton = $('<div class="Trigger_slider_button"></div>');
		this.sliderButton.append(this.sliderIcon);
		this.sliderButton.append(this.sliderLogo);
		this.sliderButton.append(this.sliderText);
		this.box.append(this.sliderButton);
		this.sliderButton.css({
			"text-align": 'center',
			"position": 'relative',
			"height": this.buttonHeight + 'px',
			"width": this.buttonWidth + 'px',
			"line-height": this.buttonHeight + 'px'
		})
		this.box.css({
			"text-align": 'center',
			"position": 'relative',
			"height": this.buttonHeight + 'px',
			"width": this.buttonWidth + 'px',
			"line-height": this.buttonHeight + 'px'
		})
	},
	domEvent: function() {
		var that = this;
		//防止事件冒泡
		this.box.on("click", function(e) {
			e = window.event || e;
			if(e.stopPropagation) {
				e.stopPropagation();
			} else {
				//ie
				e.cancelBubble = true;
			}
		})
		this.main.on("click", function(e) {
			e = window.event || e;
			if(e.stopPropagation) {
				e.stopPropagation();
			} else {
				//ie
				e.cancelBubble = true;
			}
		})
		this.refreshBox.on('click', function() {
			if(!that.isSuccess && that.isGetData) {
				that.getData()
			}
		})
		$.ajaxSetup({
			cache: false
		});
	},
	//显示验证页面
	show: function() {
		var that = this;
		//空白页面点击关闭验证页面
		$(document).click(function(e) {
			if(!that.movex && !that.isSuccess) {
				that.main.hide();
				that.sliderButton.css({
					"border": "1px solid #dddee1",
					"background": '#ffffff'
				})
				that.sliderIcon.css({
					"background-position": '-80px 0',
					'width': "20px",
					'margin-top': "-10px"
				})
				that.sliderLogo.show();
				that.sliderText.show();
				that.isShow = false;
			};
			that.docBody.removeClass('modal');
		})
		//触发按钮控制是否显示验证框
		this.box.click(function(e) {
			if(!that.isSuccess) {
				if(!that.isShow) {
					that.main.show();
					that.sliderButton.css({
						"border": "1px solid #dddee1",
						"background": '#dddddd'
					})
					that.sliderIcon.css({
						"background-position": '-160px 0',
						'width': "40px",
						'margin-top': "-5px"
					})
					that.sliderLogo.hide();
					that.sliderText.hide();
				} else {
					that.sliderButton.css({
						"border": "1px solid #dddee1",
						"background": '#ffffff'
					})
					that.sliderIcon.css({
						"background-position": '-80px 0',
						'width': "20px",
						'margin-top': "-10px"
					})
					that.sliderLogo.show();
					that.sliderText.show();
					that.main.hide();
				}
			}
			that.isShow = !that.isShow;
		})
	},
	//其他地方触发弹层，目前在移动端没有点击按钮代码触发
	showLayer:function(){
	    var that = this;
        that.isShow = true;
		that.main.show();
        // if(!that.isSuccess) {
        //     if(!that.isShow) {
        //         that.docBody.addClass('modal');
        //     } else {
        //         that.docBody.removeClass('modal');
        //         that.main.hide();
        //     }
        // }else{
        //     that.docBody.removeClass('modal');
        // }
	},
	//获取图片信息
	getData: function() {
		var that = this;
		that.isGetData = false;
		this.oLoad.show();

    
       //静态数据
        var res = {
            message:{successMessage:"调用接口成功！"},
            model:{
                bgimg2url:"http://123.56.92.221/DownloadService/PublicDownLoad?filePath=devverify/bwopenslicedd62f9601ed4d4734aad4f3cf02421e7f.png",bgimgurl:"http://123.56.92.221/DownloadService/PublicDownLoad?filePath=devverify/bwopen_5.png",bkimgurl:"http://123.56.92.221/DownloadService/PublicDownLoad?filePath=devverify/bwopenslice4f2ebf24f0b74867b61a3ea1a699e28b.png",
                bkimgypos:"31",
                challenge:"2347361e9aed4135ad932e356658ebfa"
            },
            requestId:"e85450d9-d43e-4e18-a719-9877ca65ec3d",
            success:true
		}
        that.isGetData = true;
		that.unixId = res.model.challenge;
		that.times = 0;
        that.drag(res)
        that.times = 0;
        setTimeout(function() {
			that.oLoad.hide();
		}, 200)

		//获取服务端数据
		// $.ajax({
		// 		url: this.baseURL + "/verifInfo",
		// 		dataType: 'json'
		// 	})
		// 	.then(function(res) {
		// 		that.isGetData = true;
		// 		that.drag(res)
		// 		that.unixId = res.model.challenge;
		// 		that.times = 0;
		// 		setTimeout(function() {
		// 			that.oLoad.hide();
		// 		}, 200)
		// 	}, function(err) {
		// 		//console.log(err)
		// 		alert(JSON.stringify(arguments))
		// 	})
	},
	//拖拽运动
	drag: function(data) {
		var that = this;
		var isMobileDevice = /Android|iPhone|iPad|iPod|iOS/i.test(navigator.userAgent);
		var startx, endx = 0;
		this.movex = 0;
		var startLeft = parseInt(that.getStyle(that.oButton[0], "left")) || 0; //button最开始的left偏移量

		this.startLeft = startLeft;

		var maxLeft = parseInt(that.getStyle(that.oMain[0], "width"))
		var validateBlockWidth = parseInt(that.getStyle(that.oBlock[0], "width"));
		//validateBlock移动的最大left,保证不超出主图片区域
		var maxMove = maxLeft - validateBlockWidth; //validateBlock最大的移动量
		this.oBig.attr('src', data.model.bgimg2url).css({
			"width": '100%',
			"height": "100%"
		})
		this.oBlock.attr({
			'src': data.model.bkimgurl
		}).css({
			'top': data.model.bkimgypos + 'px'
		})
		this.oAll.attr({
			'src': data.model.bgimgurl
		}).css({
			"width": '100%',
			"height": "100%",
			"z-index": '10',
			"position": 'absolute',
			"left": 0,
			"top": 0
		})
		if(!that.oButton[0][isMobileDevice?'ontouchstart':'onmousedown']) {
			that.oButton[0][isMobileDevice?'ontouchstart':'onmousedown'] = function(evt) {

				startLeft = that.startLeft;

				that.oAll.hide()
				that.oButton.addClass('validate_button_drag')
				that.startTime = new Date().getTime();
				evt = window.event || evt;
				if(evt.preventDefault) {
					evt.preventDefault();
				} else {
					//ie
					evt.returnValue = false;
				}
				that.oButton[0].style.transition = "none"; //取消过度效果
				that.oBlock[0].style.transition = "none";
				that.oProgress[0].style.transition = "none";
				left = parseInt(that.getStyle(that.oButton[0], "left")); //点下时获取button的left值
				blockleft = parseInt(that.getStyle(that.oBlock[0], "left")); //点下时获取block的left值
				startx = isMobileDevice?evt.changedTouches[0].clientX:evt.clientX; //点下鼠标时鼠标相对于视图的偏移量
				document[isMobileDevice?'ontouchmove':'onmousemove'] = function(evt) { //document监听mousemove可防止鼠标不再button上时不会产生bug
					if(!that.isSuccess) {
						evt = evt || window.event;
						endx = isMobileDevice?evt.changedTouches[0].clientX:evt.clientX; //鼠标移动后鼠标相对于视图的偏移量
						that.movex = endx - startx; //鼠标滑动的距离
						if((that.movex + left) < startLeft) {
							that.movex = startLeft - left;
						}
						//防止button向左移出box,that.movex为此值时，left + that.movex值为startLeft
						if(that.movex + left > startLeft + maxMove) { //防止button向右移出
							that.movex = startLeft + maxMove - left; //that.movex为此值时，left+that.movex为startLeft+maxMove
						}
						that.oButton[0].style.left = 10 + left + that.movex + "px"; //button和block根据鼠标的移动而移动
						that.oBlock[0].style.left = blockleft + that.movex + "px";
						that.oProgress[0].style.width = left + that.movex + 30 + "px";
					}
				}
				document[isMobileDevice?'ontouchend':'onmouseup'] = function(e) {
					that.oButton.removeClass('validate_button_drag')
					endLeft = parseInt(that.getStyle(that.oButton[0], "left"));
					that.movex = parseInt(that.movex);
					if((!that.isSuccess) && (endLeft - startLeft - 10) == that.movex) {
						//鼠标放开后button和block缓慢向后滑,滑倒开始位置
						that.verification(startLeft)

					}
					document[isMobileDevice?'ontouchmove':'onmousemove'] = null;
					document[isMobileDevice?'ontouchend':'onmouseup'] = null;
				}
			}
		}
	},
	//验证
	verification: function(startLeft) {
		var that = this;
		//服务端校验
		// var url = "/checkVerif?unixId=" + that.unixId + "&xAxis=" + that.movex;
		// $.ajax({
		// 		url: this.baseURL + url,
		// 		dataType: 'json'
		// 	})
		// 	.then(function(res) {
		// 		if(res.model.resul == "SUCCESS") {
		// 			var cert = res.model.cert;
		// 			window.cert = cert;
		// 			localStorage.setItem('token', cert);
		// 			that.success()
		// 		} else {
		// 			that.fail(startLeft)
		// 		}
		// 	}, function(err) {
		// 		//console.log(err)
        // 	})
		
		//静态操作
        var cert = 'e61dac1329b5415f91289457360ab1f5';
        window.cert = cert;
        localStorage.setItem('token', cert);
        that.success()
	},
	//验证成功
	success: function() {
		var that = this;
		this.endTime = new Date().getTime();
		this.time = ((this.endTime - this.startTime) / 1000).toFixed(1);
		if(this.time >= 20) {
			this.time = 20
		}
		this.oTimeBox.css({
				background: '#1FCA74'
			})
			.html(this.time + '秒的速度，超过了' + Math.round(100 - (this.time / 20).toFixed(2) * 100) + '%的用户')
			.show()
		this.oButton.css({
			"background-position": '-380px 0'
		})
		this.refreshBox.css({
			color: '#dddee1'
		})
		this.icon.css({
			'background-position': '-140px 0'
		})
		that.isSuccess = true;
		setTimeout(function() {

		    that.successCallback && that.successCallback();

			that.main.hide();
            that.docBody.removeClass('modal');

			//触发按钮
			that.sliderButton.css({
				"border": "1px solid #dddee1",
				"background": 'rgba(31,202,0,0.1)'
			})
			that.sliderIcon.css({
				"background-position": '-60px 0',
				'width': "20px",
				'margin-top': "-10px"
			})
			that.sliderLogo.show();
			that.sliderText.html("恭喜，验证成功").show().css({
				color: '#1FCA74'
			})
			that.movex = 0;
		}, 1000)
	},
	//验证失败
	fail: function(startLeft) {
		var that = this;
		this.oTimeBox.html("图像貌似没有拼合哦，请重新尝试");
		this.oTimeBox.css({
			background: '#F44336'
		})
		this.oTimeBox.show()
		setTimeout(function() {
			that.oTimeBox.hide()
		}, 1000)
		this.oButton.addClass('validate_button_false').removeClass('validate_button_drag');
		this.shakeMove({
			obj: this.main[0],
			attr: 'left'
		});
		setTimeout(function() {
			that.resetSlider();
			that.oAll.show();
			//失败三次重新获取图片
			if(that.times >= 2){
				that.getData();
			}else{
				that.times ++;
			}
		}, 500)
	},
	resetSlider:function(){
		var that = this;
		var startLeft = this.startLeft;
		that.isSuccess = false;
        that.oTimeBox.hide();
        that.oButton.removeClass('validate_button_false').removeClass('validate_button_drag');
        that.oButton[0].style.transition = "left 0.3s linear";
        that.oBlock[0].style.transition = "left 0.3s linear";
        that.oProgress[0].style.transition = "width 0.3s linear";
        that.oButton[0].style.left = startLeft + "px";
        that.oBlock[0].style.left = startLeft + "px";
        that.oProgress[0].style.width = 0;
        that.movex = 0;

        this.oButton.removeAttr('style');
        this.oProgress.removeAttr('style');

        this.getData();

	},
	//获取当前样式
	getStyle: function(element, att) {
		if(window.getComputedStyle) {
			//优先使用W3C规范
			return window.getComputedStyle(element)[att];
		} else {
			//针对IE9以下兼容
			return element.currentStyle[att];
		}
	},
	//抖动效果
	shakeMove: function(json) {
		//声明要进行抖动的元素
		var obj = json.obj;
		//声明元素抖动的最远距离
		var target = json.target;
		//默认值为5
		target = Number(target) || 5;
		//声明元素的变化样式
		var attr = json.attr;
		//默认为'left'
		attr = attr || 'left';
		//声明元素的起始抖动方向
		var dir = json.dir;
		//默认为'1'，表示开始先向右抖动
		dir = Number(dir) || '1';
		//声明元素每次抖动的变化幅度
		var stepValue = json.stepValue;
		stepValue = Number(stepValue) || 2;
		//声明回调函数
		var fn = json.fn;
		//声明步长step
		var step = 0;
		//保存样式初始值
		var attrValue = parseFloat(this.getStyle(obj, attr));
		//声明参照值value
		var value;
		//清除定时器
		if(obj.timer) {
			return;
		}
		//开启定时器
		obj.timer = setInterval(function() {
			//抖动核心代码
			value = dir * (target - step);
			//当步长值大于等于最大距离值target时
			if(step >= target) {
				step = target
			}
			//更新样式值
			obj.style[attr] = attrValue + value + 'px';
			//当元素到达起始点时，停止定时器
			if(step == target) {
				clearInterval(obj.timer);
				obj.timer = 0;
				//设置回调函数
				fn && fn.call(obj);
			}
			//如果此时为反向运动，则步长值变化
			if(dir === -1) {
				step = step + stepValue;
			}
			//改变方向
			dir = -dir;
		}, 50);
	}
}