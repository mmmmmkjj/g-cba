(function() {
/**
 *	{
 * 		imgs: 待加载图片数组
 * 		loading: 加载中执行的函数
 * 		loaded: 加载完成执行的函数
 * }
 */
	window.loadingFun = function(obj) {
		if(obj.imgs && obj.imgs instanceof Array && obj.imgs.length > 0) {
			var _index = 0;
			var _imgArr = [];
			for(var i = 0;i < obj.imgs.length;i ++) {
				var img = new Image;
				img.src = obj.imgs[i];
				_imgArr.push(img);
				img.index = i;
				img.onload = function() {
					_index ++;
					if(obj.loading && typeof obj.loading == "function") {
						obj.loading(this.index,this);
					}
					if(_index == obj.imgs.length) {
						if(obj.loaded && typeof obj.loaded == "function") {
							obj.loaded(_imgArr);
						}
					}
				}
			}
		}
	}
})();
