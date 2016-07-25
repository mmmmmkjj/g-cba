$(document).on("touchstart",function(e) {
	e.preventDefault();
});
window.score = 0;
var imgArr = ['img/ball.png','img/ball_shadow.png','img/bg.jpg','img/emd_bg.png','img/hoop_bottom.png','img/hoop_top.png','img/join.png','img/net.png','img/reset_game.png','img/stands.jpg','img/start.png','img/start_bg.jpg']
loadingFun({
	imgs: imgArr,
	loading: function() {
		
	},
	loaded: function() {
		startGames();
	}
});

function startGames() {
	$("#start_btn").on("touchstart",function() {
		$("#start").css("display","none");
	});
	var ball1 = new createBall("#ball1", "#shadow1");
	var ball2 = new createBall("#ball2", "#shadow2");
	var ball3 = new createBall("#ball3", "#shadow3");
}

//球和影子对象
function createBall(id_ball, id_shadow) {
	this.Ball = $(id_ball);
	this.BallWidth = $("#ball1").width();
	this.Shadow = $(id_shadow);
	this.Score = $("#score");
	this.initScore = 0;
	this.Time = $("#time");
	this.initTime = 20;
	this.Net = $("#net");
	this.Width = $(".game").width();
	this.Height = $(".game").height();
	this.scale = 0.6;//球缩放
	this.disX = 0;
	this.disY = 0;
	this._x = 0;//touchend时球的位置
	this._y = 0;
	this.endX = 0;
	this.endY = 0;
	this.defaultPos = 0;
	this.Game = true;
	this.timer = null;//倒计时定时器
	this.timer2 = null;//投球定时器
	
	this.maxPos = 0;
	this.distance = 0;
	this.recode = 0;
	
	this.isRebound1 = true;//碰撞状态
	this.isRebound2 = true;
	this.isRebound3 = true;
	this.isRebound4 = true;
	this.isRebound5 = true;
	this.isRebound6 = true;
	this.isRebound7 = true;
	this.isRebound8 = true;
	
	this.reboundDisY1 = this.Height * 0.75 - this.Ball.height();//反弹高度
	this.reboundDisY2 = this.Height * 0.9 - this.Ball.height();
	this.reboundDisY3 = this.Height - this.Ball.height();
	
	this.num = 0;
	this.sum = 0;
	this.deVx = this.createVy(this.sum);
	this.vx = 0;//水平速度
	this.vy = this.deVx;//垂直速度
	this.accelerated = 1;//加速度
	this.End = $("#end");
	this.span1 = $("#end>span:nth-child(1)");
	this.span2 = $("#end>span:nth-child(2)");
	this.Evaluate = $(".evaluate");
	this.Evaluate_con = ["堪称MVP级的表现！", "你就是板凳王"];
	//篮板和篮筐位置
	this.standsLeft = (this.Width*0.44)/2 -  this.BallWidth*0.7;
	this.standsRight = this.Width*0.78 - (1-0.7)*this.BallWidth/2;
	this.hoopLeft = this.Width * 0.37;
	this.hoopRight = this.Width * 0.58;
	this.hoopTop = this.Height * 0.395;
	
	this.init();
}
//初始化函数
createBall.prototype.init = function() {
	this.initPosition();
	this.times();
	this.Time.html(this.createNum(this.initTime));
	this.Score.html(this.createNum(this.initScore));
	var _this = this;
	this.Ball.on("touchstart",function(e) {
		_this.Start(e,_this);
	});
};
createBall.prototype.Start = function(ev,_this) {
	if(!this.Game) {
		return false;
	}
	/**
	 * 	事件对象返回有问题
	 */
	this.Reset();
//	console.log(ev.originalEvent.touches[0].clientX);
	_this.disX = ev.originalEvent.touches[0].clientX - _this.Ball.position().left;
	_this.disY = ev.originalEvent.touches[0].clientY - _this.Ball.position().top;
	_this.Ball.on("touchmove",function(e) {
		_this.Move(e,_this);
	});
	_this.Ball.on("touchend",function(e) {
		_this.Ended(e,_this);
	});
}
//投出
createBall.prototype.ThrowInterval = function(_this,fn) {
	this.Ball.css({
		"-webkit-transform": "scale(" + this.scale + ") translateX(" + (1 - this.scale) * this.BallWidth/2 + "px)"
	});
	clearInterval(this.timer2);
	this.timer2 = setInterval(function(_this) {
		_this._x += _this.vx;
		_this._y += _this.vy;
		_this.vy += _this.accelerated;
		if(_this.vx && _this._y > _this.Height * 0.4) {
			_this.vx = 0;
		}
		fn();
		_this.Ball.css({
			"top": _this._y,
			"left": _this._x
		});
		_this.Shadow.css({
			"left": _this._x
		});
		if(_this.isRebound7 && _this.vy < 0) {
			_this.Shadow.css({
				"-webkit-transition": "top 0.9s",
				"top": _this.Height * 0.7
			});
			_this.isRebound7 = false;
		}else if(_this.isRebound8 && _this.vy >=0) {
			_this.isRebound8 = false;
			_this.Shadow.css({
				"-webkit-transition": "top 0.2s linear",
				"top": _this.Height * 0.73
			});
		}
	},1000/60,this);
}
//反弹函数
createBall.prototype.Rebound = function(_this) {
	if(_this.isRebound1 && _this.vy > 0 && _this._y >= _this.reboundDisY1) {
		_this.vy = parseInt(-_this.vy * 0.3);
		_this.isRebound1 = false;
		_this.Shadow.css({
			"-webkit-transition": "top 0.32s linear",
			"top": _this.Height * 0.88
		});
		console.log("rebon1")
	}else if(_this.isRebound2 && _this.vy > 0 && _this.y >= _this.reboundDisY2) {
		_this.vy = parseInt(-_this.vy * 0.3);
		_this.isRebound2 = false;
		_this.Shadow.css({
			"-webkit-transition": "top 0.3s linear",
			"top": _this.Height - _this.Width * 0.03
		});
		console.log("rebon2")
	}else if(_this.vy > 0 && _this._y >= _this.reboundDisY3) {
		_this.y = _this.Height - _this.Ball.height();
		_this.vy = parseInt(-_this.vy * 0.3);
		_this.vx = 0;
		console.log("rebon3")
	}else {
	
		/**
		 *	判断条件不完善 
		 */
	}
	_this.Ball.css({
		"left": _this._x,
		"top": _this._y
	});
	if(_this.isRebound3 && _this.recode == _this.vy) {
		_this.isRebound3 = false;
		clearInterval(_this.timer2);
		return false;
	}
	_this.recode = _this.vy;
}
//垂直方向速度
createBall.prototype.createVy = function(sum) {
	if(this.sum >= this.Height * 0.45) {
		return -this.num;
	}else {
		this.num ++;
		this.sum = sum;
		return this.createVy(this.sum + this.num);
	}
}
//----------------------------------投出结果判断----------------------------------------------
createBall.prototype.Throwing = function(_this) {
	//投到篮板两边
	if(this.endX<this.standsLeft || this.endX>this.standsRight){
		this.ThrowInterval(_this,function() {
			if(!_this.maxPos && _this.vy + _this.accelerated >= 0) {
				_this.maxPos = _this.Ball.position().top;
				_this.distance = (_this.defaultPos - _this.maxPos) * 0.15;
				_this.Ball.css({"z-index": "1"});
				_this.Ball.css({
					"-webkit-transition": "-webkit-transform 0.9s opacity 0.6s",
					"-webkit-transform": "translateX(30px) scale(0.01)",
					"opcity": "0"
				});
				_this.Shadow.css({
					"-webkit-transition": "all 0.9s",
					"-webkit-transform": "translateX(30px) scale(0.01)",
					"opcity": "0"
				})
				setTimeout(function() {
					clearInterval(_this.timer2);
					_this.Ball.css({
						"-webkit-transition": "0s",
						"-webkit-transform": "translateX(0) scale(1)",
						"opcity": "1",
						"top": _this.Height-_this.Width*0.2,
						"left": "41%"
					});
					_this.Shadow.css({
						"-webkit-transition": "0s",
						"-webkit-transform": "translateX(0) scale(1)",
						"opcity": "1",
						"top": _this.Height-_this.Width*0.03,
						"left": "41%"
					})
				},1000);
			}
		});
	}else if((this.endX < this.hoopLeft-this.BallWidth*0.7) || (this.endX>this.hoopRight)) {//打篮板上
		this.ThrowInterval(_this,function() {
			if(_this.isRebound4 && _this.vy + _this.accelerated >=0) {
				setTimeout(function() {
					if(_this.endY <= _this.Height * 0.8) {
						_this.vy += -12;
					}
					_this.Ball.css({
						"-webkit-transition": "-webkit-transform 0.9s",
						"-webkit-transform": "translateX(0) scale(1)"
					});
				},300);
				_this.isRebound4 = false;
			}
			//弹回
			_this.Rebound(_this);
		});
	}else {
		if(_this.endY <= _this.Height * 0.83) {
			this.ThrowInterval(_this,function() {
				if(_this.isRebound4 && _this.vy + _this.accelerated >=0) {
					setTimeout(function() {
						if(_this.endY <= _this.Height * 0.8) {
							_this.vy += -12;
						}
						_this.Ball.css({
							"-webkit-transition": "-webkit-transform 0.9s",
							"-webkit-transform": "translateX(0) scale(1)"
						});
					},300);
					_this.isRebound4 = false;
				}
				//进入篮筐范围
				if(_this.endX <= _this.hoopLeft) {
					if(_this.endX > _this.hoopLeft - _this.BallWidth * 0.3) {//偏左边进球
						if(_this.isRebound5 && _this.vy > 0 && _this._y >= _this.Height * 0.39 - _this.Ball.height()) {
							_this._y = _this.Height * 0.39 - _this.Ball.height();
							_this.vx = 1.5;
							_this.isRebound5 = false;
							_this.Net.css({
								"-webkit-animation": "netChange 0.2s 0.2s linear"
							});
							_this.createScore(2);
							console.log("left")
						}
					}else {
						if(_this.isRebound5 && _this.vy > 0 && _this._y >= _this.Height * 0.39 - _this.Ball.height()) {
							_this._y = _this.Height * 0.39 - _this.Ball.height();
							_this.vx = -2;
							_this.vy = -5;
							_this.isRebound5 = false;
							console.log("unleft")
						}
					}
				}else if(_this.endX >= _this.hoopRight - _this.BallWidth * 0.7) {
					if(_this.endX < _this.hoopRight - _this.BallWidth * 0.3) {
						if(_this.isRebound5 && _this.vy > 0 && _this._y >= _this.Height * 0.39 - _this.Ball.height()) {
							_this._y = _this.Height * 0.39 - _this.Ball.height();
							_this.vx = -2;
							_this.isRebound5 = false;
							_this.Net.css({
								"-webkit-animation": "netChange 0.2s 0.2s linear"
							});
							_this.createScore(2);
							console.log("right")
						}
					}else {
						if(_this.isRebound5 && _this.vy > 0 && _this._y >= _this.Height * 0.39 - _this.Ball.height()) {
							_this._y = _this.Height * 0.39 - _this.Ball.height();
							_this.vx = 2;
							_this.vy = -5;
							_this.isRebound5 = false;
							console.log("unright")
						}
					}	
				}else {
					if(_this.isRebound6 && _this.vy > 0 && _this._y > _this.Height * 0.3) {
						//3分
						if(_this.endY <= _this.Height * 0.75) {
							if(Math.random() > 0.5) {
								_this.Net.css({
									"-webkit-animation": "netChange 0.2s linear"
								});
								_this.isRebound6 = false;
								_this.createScore(3);
								console.log("3")
							}else {
								if(_this.isRebound6 && _this.vy > 0 && _this._y >= _this.Height * 0.4 - _this.Ball.height()) {
									_this.vy = -5;
									_this.isRebound6 = false;
									_this.Ball.css({"z-index": "2"});
									console.log("un3")
								}
							}
						}else {
							if(_this.isRebound6 && _this.vy > 0 && _this._y >= _this.Height * 0.4 - _this.Ball.height()) {
								_this.vy = -5;
								_this.isRebound6 = false;
								_this.Ball.css({"z-index": "2"});
								console.log("un3-")
							}
						}
					}
				}
				//弹回
				_this.Rebound(_this);
			});
		}else {
			this.ThrowInterval(_this,function() {
				if(_this.isRebound4 && _this.vy + _this.accelerated >= 0) {
					setTimeout(function() {
						if(_this.endY <= _this.Height * 0.8) {
							_this.vy += -12;
						}
						_this.Ball.css({
							"-webkit-transition": "-webkit-transform 0.9s",
							"-webkit-transform": "scale(1) translateX(0)"
						});
					},300);
					_this.isRebound4 = false;
				}
				//弹回
				_this.Rebound(_this);
			});
		}
	}
}
//重置初值
createBall.prototype.Reset = function() {
	this.defaultPos = 0;
	this.accelerated = 1;
	this.vx = 0;
	this.vy = this.deVx;
	this.scale = 0.6;
	this.isRebound1 = true;
	this.isRebound2 = true;
	this.isRebound3 = true;
	this.isRebound4 = true;
	this.isRebound5 = true;
	this.isRebound6 = true;
	this.isRebound7 = true;
	this.isRebound8 = true;
	this.maxPos = 0;
	this.distance = 0;
	this.recode = 0;
	clearInterval(this.timer2);
	this.Ball.css({
		"z-index": "2",
		"-webkit-transition": "-webkit-transform 0.9s"
	});
	this.Net.css({"-webkit-animation": ""});
}
//释放篮球
createBall.prototype.Ended = function(ev,_this) {
	this.Ball.on("touchstart",function(e) {
		_this.Start(e,_this);
	});
	_this.defaultPos = _this.Ball.position().top;
	_this._x = _this.Ball.position().left;
	_this._y = _this.Ball.position().top;
	_this.endX = _this.Ball.position().left;
	_this.endY = _this.Ball.position().top;
	this.Throwing(_this);
}
//拖动球+触壁
createBall.prototype.Move = function(ev,_this) {
	_this.x = ev.originalEvent.touches[0].clientX - _this.disX;
	_this.y = ev.originalEvent.touches[0].clientY - _this.disY;
	if(_this.x > _this.Width-_this.BallWidth) {
		_this.x = _this.Width-_this.BallWidth
	}else if(_this.x < 0) {
		_this.x = 0;
	}
	if(_this.y > _this.Height - _this.BallWidth) {
		_this.y = _this.Height - this.BallWidth;
	}else if(_this.y < 0) {
		_this.y = 0;
	}else if(_this.y < _this.Height * 0.65) {
		//到达一定高度自动投出
		_this.Ball.trigger("touchend");
		_this.Ball.off();
		_this.Ball.on("touchstart",function(e) {
			_this.Start(e,_this);
		});
		return;
	}
	$(_this.Ball).css({
		"left": _this.x,
		"top": _this.y
	});
	$(_this.Shadow).css({
		"left": _this.x
	});
}
//倒计时
createBall.prototype.times = function() {
	var _this = this;
	this.timer = setInterval(function() {
		_this.initTime --;
		if(_this.initTime == 0) {
			clearInterval(_this.timer);
			setTimeout(function() {
				if(window.score  < 10) {
					_this.Evaluate.html(_this.Evaluate_con[1]);
				}else {
					_this.Evaluate.html(_this.Evaluate_con[0]);
				}
				_this.initScore = _this.Score.html();
				_this.initScore = _this.initScore.split('');
				_this.span1.html(_this.initScore[0]);
				_this.span2.html(_this.initScore[1]);
				_this.End.css("display", "block");
			},500);
			_this.Game = false;
		}
		_this.Time.html(_this.createNum(_this.initTime));
		_this.Score.html(_this.createNum(window.score));		
	},1000);
};
//初始位置
createBall.prototype.initPosition = function() {
	this.Ball.css("top",this.Height-this.Width*0.2);
	this.Shadow.css("top",this.Height-this.Width*0.02);
}
//计分
createBall.prototype.createScore = function(num) {
	if(!this.Game) {
		return false;
	}
	this.initScore += num;
	window.score += num;
	this.Score.html(this.createNum(window.score));
}
//个位数前加0
createBall.prototype.createNum = function(num) {
	if(num < 10) {
		return "0" + num;
	}else {
		return num;
	}
};
$(".close").on("touchstart mousedown", function() {
	location.reload();
});