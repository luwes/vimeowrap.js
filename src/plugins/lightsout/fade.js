
var Fade = function(element, time, dark, callback) {
	
	this.element = element;
	this.time = time || 1000;
	this.dark = dark || 0.8;
	
	this.opacity = 0;
	
	var _this = this;
	var interval;
	
	var supportOpacity = "opacity" in this.element.style;
	if (!supportOpacity) this.element.style.zoom = 1;
    
	function setOpacity(o) {
		_this.element.style.opacity = "" + o;
		_this.element.style.filter = "alpha(opacity=" + Math.round(o*100) + ")";
		_this.opacity = o;
	}

	this.off = function() {
		if (typeof callback === "function") callback();
		_this.element.style.display = "block";
		clearInterval(interval);
		var t0 = new Date().getTime();
		var o0 = _this.opacity;
		interval = setInterval(function() {
			var dt = (new Date().getTime()-t0)/_this.time;
			if (dt >=1) {
				dt = 1;
				clearInterval(interval);
			}
			setOpacity(_this.dark*dt+o0*(1-dt));
		}, 1000 / 60);
	};
	
	this.on = function() {
		clearInterval(interval);
		var t0 = new Date().getTime();
		var o0 = _this.opacity;
		interval = setInterval(function() {
			var dt = (new Date().getTime()-t0)/_this.time;
			if (dt >=1) {
				dt = 1;
				clearInterval(interval);
				_this.element.style.display = "none";
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
