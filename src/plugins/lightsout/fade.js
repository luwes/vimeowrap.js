
var Fade = function(el, time, dark, callback) {
	
	this.el = el;
	this.time = time || 1000;
	this.dark = dark || 0.8;
	
	this.opacity = 0;
	
	var _this = this;
	var interval;
	
	var supportOpacity = 'opacity' in this.el.style;
	if (!supportOpacity) this.el.style.zoom = 1;
    
	function setOpacity(o) {
		_this.el.style.opacity = '' + o;
		_this.el.style.filter = 'alpha(opacity=' + Math.round(o*100) + ')';
		_this.opacity = o;

		//force repaint, Chrome bug
		_this.el.style.display = 'none';
		repaint = _this.el.offsetHeight;
		_this.el.style.display = '';

		if (o === 0) {
			_this.el.style.display = 'none';
		}
	}

	this.off = function() {
		if (typeof callback === 'function') callback();
		_this.el.style.display = '';
		clearInterval(interval);
		var t0 = +new Date();
		var o0 = _this.opacity;
		interval = setInterval(function() {
			var dt = (new Date()-t0)/_this.time;
			if (dt >=1) {
				dt = 1;
				clearInterval(interval);
			}
			setOpacity(_this.dark*dt+o0*(1-dt));
		}, 1000 / 60);
	};
	
	this.on = function() {
		clearInterval(interval);
		var t0 = +new Date();
		var o0 = _this.opacity;
		interval = setInterval(function() {
			var dt = (new Date()-t0)/_this.time;
			if (dt >=1) {
				dt = 1;
				clearInterval(interval);
			}
			setOpacity(0*dt+o0*(1-dt));
		}, 1000 / 60);
	};
	
	this.toggle = function() {
		if (_this.opacity < 0.5) {
			_this.off();
		} else {
			_this.on();
		}
	};
};
