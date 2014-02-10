(function(window, document) {
var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	query: function(selector, el) {
		if (typeof selector != 'string') return null;
		el = el || document;
		return el.querySelector(selector);
	},

	clamp: function(val, min, max) {
		return val < min? min : (val > max? max : val);
	},

	append: function(parent, css, tag) {
		var el = document.createElement(tag || 'div');
		_.css(el, css);
		return parent.appendChild(el);
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	invoke: function(array, method) {
		var args = slice.call(arguments, 2);
		for (var i = 0; i < array.length; i++) {
			array[i][method].apply(array[i], args);
		}
	},

	on: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	css: function(el, props) {
		for (var prop in props) {
			try {
				el.style[_.camel(prop)] = _.addUnit(props[prop]);
			} catch(e) {
				//console.log(e);
			}
		}
	},

	camel: function(str) {
		return (''+str).replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
	},

	getPointer: function(e) {
		var x = e.pageX,
			y = e.pageY;
		if (e.touches && e.touches.length) {
			x = e.touches[0].pageX;
			y = e.touches[0].pageY;
		}
		if (x == null) {
			var doc = document.documentElement;
			var body = document.body;
			x = e.clientX + (doc.scrollLeft || body.scrollLeft || 0) - (doc.clientLeft || body.clientLeft || 0);
			y = e.clientY + (doc.scrollTop || body.scrollTop  || 0) - (doc.clientTop  || body.clientTop  || 0);
		}
		return { x: x, y: y };
	},

	getOffset: function(el) {
		var docElem = document.documentElement;
		var box = el.getBoundingClientRect(el);
		return {
			top: box.top + (window.pageYOffset || docElem.scrollTop)  - (docElem.clientTop || 0),
			left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
		};
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	},

	norm: function(val, min, max) {
		return (val - min) / (max - min);
	},

	map: function(val, min1, max1, min2, max2) {
		return _.lerp( _.norm(val, min1, max1), min2, max2 );
	}
};

/** @license
 * Skinny Scroll
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/07/30)
 *			1.1 - (2013/01/25)
 */

SkinnyScroll.defaults = {
	color: '#fff',
	radius: 6,
	width: 6
};

function SkinnyScroll(el, options) {
	this.config = _.extend(SkinnyScroll.defaults, options);

	this.events = {
		scroll: new Signal()
	};

	this.el = _.query(el) || el;
	this.el.style.overflow = 'hidden';

	this.page = new Page(this, this.el.children[0]);

	this.sbar = new Scrollbar(this, this.page);
	this.el.appendChild(this.sbar.el);

	this.controllers = [];
	this.controllers.push(new MouseController(this, this.page));
	this.controllers.push(new TouchController(this, this.page));

	this.redraw();
	this._redraw = _.bind(this.redraw, this);
	_.on(window, 'resize', this._redraw);
}

SkinnyScroll.prototype.y = function(n) {
	this.page.morph.set('y', n);
};

SkinnyScroll.prototype.redraw = function() {
	this.height = this.el.offsetHeight;
	this.page.redraw();
	this.sbar.redraw();
};

SkinnyScroll.prototype.destroy = function() {
	_.invoke(this.controllers, 'destroy');
	_.off(window, 'resize', this._redraw);
	this.sbar.destroy();
};

window.SkinnyScroll = SkinnyScroll;

(function(window, document) {
var divstyle = document.createElement('div').style;

var _ = {

	extend: function(src, dest) {
		for (var key in dest) {
			src[key] = dest[key];
		}
		return src;
	},

	bind: function(fn, context) {
		return function() { fn.apply(context, [].slice.call(arguments)); };
	},

	style: function(el, prop) {
		if (window.getComputedStyle) {
			return getComputedStyle(el).getPropertyValue(_.uncamel(prop));
		} else if (el.currentStyle) {
			return el.currentStyle[_.camel(prop)];
		} else return el.style[_.camel(prop)];
	},

	matrix: function(str) {
		var arr = str.match(/\(([-\d., ]+?)\)/)[1].split(', ');
		if (arr.length == 6) {
			return { x: arr[4], y: arr[5] };
		} else if (arr.length == 16) {
			return { x: arr[12], y: arr[13] };
		}
	},

	contains: function(list, el) {
		for (var key in list) {
			if (list[key] === el) return true;
		}
		return false;
	},

	query: function(selector, el) {
		if (typeof selector != 'string') return null;
		el = el || document;
		return el.querySelector(selector);
	},

	vendorPropName: function(name) {
		if (name in divstyle) return name;

		var camel = _.camel('-' + name);
		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		for (var i = 0; i < prefixes.length; i++) {
			name = prefixes[i] + camel;
			if (name in divstyle) return name;
		}
	},

	has3d: function() {
		var transform = _.vendorPropName('transform');
		divstyle[transform] = '';
		divstyle[transform] = 'rotateY(90deg)';
		return divstyle[transform] !== '';
	},

	on: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.attachEvent) {
				el.attachEvent('on' + arr[i], fn);
			} else {
				el.addEventListener(arr[i], fn, false);
			}
		}
	},

	off: function(el, type, fn) {
		var arr = type.split(' ');
		for (var i = 0; i < arr.length; i++) {
			if (el.detachEvent) {
				el.detachEvent('on' + arr[i], fn);
			} else {
				el.removeEventListener(arr[i], fn, false);
			}
		}
	},

	camel: function(str) {
		return (''+str).replace(/-(\w)/g, function(match, c) {
			return c.toUpperCase();
		});
	},

	uncamel: function(str) {
		return (''+str).replace(/([A-Z])/g, '-$1').toLowerCase();
	},

	addUnit: function(v) {
		return typeof v == 'string' ? v : v + 'px';
	},

	getUnit: function(v) {
		return typeof v == 'string' ? v.replace(/[-\d\.]/g, '') : 'px';
	},

	num: function(n) {
		return +(''+n).replace(/[^-\d.]/g, '');
	},

	lerp: function(ratio, start, end) {
		return start + (end - start) * ratio;
	}
};

/** @license
 * Morph
 *
 * Author: Wesley Luyten
 * Version: 1.0.0 - (2013/02/06)
 */

Morph.defaults = {
	duration: 500
};

Morph.support = {
	transition: _.vendorPropName('transition'),
	transform: _.vendorPropName('transform'),
	transform3d: _.has3d()
};

function Morph(el) {
	if (!(this instanceof Morph)) return new Morph(el);
	this.el = _.query(el) || el;
	this.events = {
		update: new Signal(),
		end: new Signal()
	};
	if (Morph.support.transition) {
		this.engine = new V8(this);
	} else {
		this.engine = new V6(this);
	}
	this.duration(Morph.defaults.duration);
}

Morph.prototype.duration = function(dur) {
	this.engine.duration(dur);
	return this;
};

Morph.prototype.get = function(prop) {
	return this.engine.get(prop);
};

Morph.prototype.set = function(obj, val) {
	this.engine.set(obj, val);
	return this;
};

Morph.prototype.to = function(prop, val) {
	this.engine.to(prop, val);
	return this;
};

Morph.prototype.ease = function(fn) {
	this.engine.ease(fn);
	return this;
};

Morph.prototype.start = function() {
	this.engine.start();
	return this;
};

Morph.prototype.on = function(event, fn) {
	this.events[event].on(fn);
	return this;
};

Morph.prototype.off = function(event, fn) {
	this.events[event].off(fn);
	return this;
};

window.Morph = Morph;


function Signal() {
	this.c = [];
}

Signal.prototype.on = function(fn, c) {
	this.c.push({fn: fn, c: c});
	return this;
};

Signal.prototype.fire = function() {
	var args = [].slice.call(arguments);
	for (var i = 0; i < this.c.length; i++) {
		this.c[i].fn.apply(this.c[i].c || this, args);
	}
	return this;
};

Signal.prototype.off = function(fn) {
	if (fn) {
		for (var i = 0; i < this.c.length; i++) {
			if (this.c[i] === fn) {
				this.c.splice(i, 1);
				i--;
			}
		}
	} else {
		this.c = [];
	}
	return this;
};


V6.aliases = {
	x: 'left',
	y: 'top'
};

function V6(main) {
	this.main = main;
	this.el = main.el;
	this._start = {};
	this._end = {};
}

V6.prototype.duration = function(dur) {
	this._duration = dur;
};

V6.prototype.get = function(prop) {
	prop = V6.aliases[prop] || prop;
	return _.style(this.el, prop);
};

V6.prototype.set = function(obj, val) {
	_.extend(this._start, this.add(obj, val));
	this.setProperties();
	this.update();
};

V6.prototype.to = function(obj, val) {
	_.extend(this._end, this.add(obj, val));
};

V6.prototype.add = function(obj, val) {
	var map = {};
	if (val !== undefined) map[obj] = val;
	else _.extend(map, obj);
	for (var alias in V6.aliases) {
		if (map[alias] !== undefined) {
			map[V6.aliases[alias]] = map[alias];
			delete map[alias];
		}
	}
	return map;
};

V6.prototype.setProperties = function() {
	for (var prop in this._start) {
		this.el.style[_.camel(prop)] = _.addUnit(this._start[prop]);
	}
};

V6.prototype.initProperties = function() {
	for (var prop in this._end) {
		if (!this._start[prop]) {
			this._start[prop] = _.style(this.el, prop) || 1;
		}
	}
};

V6.prototype.applyProperties = function(ratio) {
	for (var prop in this._end) {
		var start = this._start[prop];
		var end = this._end[prop];
		var calc = _.lerp(ratio, _.num(start), _.num(end));
		this.el.style[_.camel(prop)] = calc + _.getUnit(end);
	}
};

V6.prototype.ease = function(fn) {
	
};

V6.prototype.start = function() {
	this.reset();
	this.initProperties();

	var _this = this;
	var ratio = 0;
	var last = +new Date();
	var tick = function() {
		ratio += (new Date() - last) / _this._duration;
		ratio = ratio > 1 ? 1 : ratio;
		last = +new Date();
		_this.applyProperties(ratio);
		_this.update();
		if (ratio === 1) _this.end();
	};
	this.id = setInterval(tick, 16);
};

V6.prototype.update = function() {
	this.main.events.update.fire();
};

V6.prototype.end = function() {
	clearInterval(this.id);
	this.main.events.end.fire();
};

V6.prototype.reset = function() {
	clearInterval(this.id);
	this._start = {};
};


V8.translate = _.has3d ? ['translate3d(',', 0)'] : ['translate(',')'];

V8.ends = [
	'transitionend',
	'webkitTransitionEnd',
	'oTransitionEnd',
	'MSTransitionEnd'
].join(' ');

V8.aliases = {
	x: {
		set: function(map, v) { map.transformX = V8.translate.join(v + ', 0'); },
		get: function(el, prop) { return _.matrix(_.style(el, _.vendorPropName('transform'))).x; }
	},
	y: {
		set: function(map, v) { map.transformY = V8.translate.join('0, ' + v); },
		get: function(el, prop) { return _.matrix(_.style(el, _.vendorPropName('transform'))).y; }
	}
};

function V8(main) {
	this.main = main;
	this.el = main.el;

	this._update = _.bind(this.update, this);
	this._end = _.bind(this.end, this);

	this.reset();
}

V8.prototype.reset = function() {
	this._props = {};
	this._transitionProps = [];
	this._transforms = [];
	this._ease = '';
};

V8.prototype.duration = function(n) {
	this._duration = n;
};

V8.prototype.ease = function(fn) {
	this._ease = fn;
};

V8.prototype.setVendorProperty = function(prop, val) {
	this._props[_.uncamel(_.vendorPropName(prop))] = val;
};

V8.prototype.get = function(prop) {
	if (V8.aliases[prop]) return V8.aliases[prop].get(this.el, prop);
	return _.style(this.el, _.vendorPropName(prop));
};

V8.prototype.set = function(obj, val) {
	this.duration(0);
	this.to(obj, val);
	this.start();
	this.update();
};

V8.prototype.to = function(obj, val) {
	var adds = this.add(obj, val);
	for (var prop in adds) {
		if (prop.match(/^transform/)) {
			this.transform(adds[prop]);
			delete adds[prop];
		} else {
			this.transition(prop);
			this._props[prop] = adds[prop];
		}
	}
};

V8.prototype.add = function(obj, val) {
	var map = {};
	if (val !== undefined) map[obj] = val;
	else _.extend(map, obj);
	for (var prop in map) {
		if (V8.aliases[prop] !== undefined) {
			var value = _.addUnit(map[prop]);
			V8.aliases[prop].set(map, value);
			delete map[prop];
		}
	}
	return map;
};

V8.prototype.transition = function(prop) {
	if (!_.contains(this._transitionProps, prop)) {
		this._transitionProps.push(prop);
	}
};

V8.prototype.transform = function(transform) {
	if (!_.contains(this._transforms, transform)) {
		this._transforms.push(transform);
	}
};

V8.prototype.applyProperties = function(map) {
	for (var prop in map) {
		this.el.style.setProperty(prop, map[prop]);
	}
};

V8.prototype.start = function() {

	if (this._transforms.length) {
		this.setVendorProperty('transform', this._transforms.join(' '));
		this.transition(_.uncamel(Morph.support.transform));
	}

	this.setVendorProperty('transition', '');
	if (this._duration > 0) {
		this.setVendorProperty('transition-duration', this._duration + 'ms');
		this.setVendorProperty('transition-property', this._transitionProps.join(', '));
		this.setVendorProperty('transition-timing-function', this._ease);

		clearInterval(this.id);
		this.id = setInterval(this._update, 16);

		this.fired = false;
		_.on(this.el, V8.ends, this._end);
	}

	this.applyProperties(this._props);
	this.reset();
};

V8.prototype.update = function() {
	this.main.events.update.fire();
};

V8.prototype.end = function() {
	clearInterval(this.id);
	_.off(this.el, V8.ends, this._end);
	if (!this.fired) {
		this.fired = true;
		this.main.events.end.fire();
	}
};
})(window, document);

function MouseController(main, page) {
	this.main = main;
	this.page = page;

	this.y = 0;
	main.events.scroll.on(function(y) { this.y = parseFloat(y); }, this);

	this._scroll = _.bind(this.scroll, this);
	_.on(main.el, 'DOMMouseScroll mousewheel', this._scroll);
}

MouseController.prototype.scroll = function(e) {
	e = e || window.event;
	if (this.page.height > this.main.height) {
		if (e.preventDefault) e.preventDefault();

		var delta = e.wheelDelta ? -e.wheelDelta / 120 : e.detail / 3;
		this.y -= delta * 20;
		this.y = _.clamp(this.y, -this.page.height + this.main.height, 0);
		
		this.page.morph.set('y', this.y);
		return false;
	}	
};

MouseController.prototype.destroy = function() {
	_.off(this.main.el, 'DOMMouseScroll mousewheel', this._scroll);
};


function Page(main, el) {
	this.main = main;
	this.el = el;
	this.morph = new Morph(el);
	this.morph.on('update', _.bind(this.update, this));
}

Page.prototype.update = function() {
	this.main.events.scroll.fire(this.morph.get('y'));
};

Page.prototype.redraw = function() {
	this.height = this.el.offsetHeight;
};


function ScrollbarController(main, page, sbar, hand) {
	this.main = main;
	this.page = page;
	this.sbar = sbar;
	this.hand = hand;

	this._lock = _.bind(this.lock, this);
	this._drag = _.bind(this.drag, this);
	_.on(sbar, 'mousedown touchstart', this._lock);
	_.on(hand, 'mousedown touchstart', this._lock);

	this.dragging = false;
	this.offset = 0;
}

ScrollbarController.prototype.lock = function(e) {
	e = e || window.event;
	e.target = e.target || e.srcElement;

	this.offset = e.target == this.hand ? _.getPointer(e).y - _.getOffset(this.hand).top : 0;

	this.dragging = /mousedown|touchstart/.test(e.type);
	this.drag(e);

	var fn = this.dragging ? 'on' : 'off';
	_[fn](document, 'mouseup touchend', this._lock);
	_[fn](document, 'mousemove touchmove', this._drag);
	_[fn](document, 'selectstart', this.stopSelect);
};

ScrollbarController.prototype.drag = function(e) {
	e = e || window.event;
	if (this.dragging) {
		if (e.stopPropagation) e.stopPropagation();
		if (e.preventDefault) e.preventDefault();
		
		var pointerY = _.getPointer(e).y - _.getOffset(this.sbar).top - this.offset;
		var y = _.map(pointerY, 0, this.sbar.offsetHeight-this.hand.offsetHeight, 0, this.page.height-this.main.height);
		y = _.clamp(y, 0, this.page.height - this.main.height);
		
		this.page.morph.set('y', -y);
		return false;
	}
};

ScrollbarController.prototype.stopSelect = function() {
	return false;
};


function Scrollbar(main, page) {
	this.main = main;
	this.page = page;
	var _this = this;

	var color = main.config.color;
	var radius = main.config.radius;
	var width = main.config.width;

	this.el = document.createElement('div');
	_.css(this.el, {
		position: 'absolute',
		right: 0,
		top: 2,
		bottom: 2,
		width: width + 2,
		zIndex: 90
	});
	this.el.className = 'skinnyscrollbar';

	this.back = _.append(this.el, {
		backgroundColor: color,
		filter: 'alpha(opacity=20)',
		opacity: '0.2',
		borderRadius: radius,
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: width
	});

	this.hand = _.append(this.el, {
		backgroundColor: color,
		filter: 'alpha(opacity=40)',
		opacity: '0.4',
		borderRadius: radius,
		position: 'absolute',
		left: 0,
		top: 0,
		width: width,
		height: 7
	});

	new ScrollbarController(main, page, this.el, this.hand);
	main.events.scroll.on(this.y, this);
}

Scrollbar.prototype.y = function(y) {
	this._y = y;

	var offset = -parseFloat(y) / this.ratio;
	if (isNaN(offset)) offset = 0;

	var diff = (offset + this.handHeight) - this.height;
	var handStyle = this.hand.style;
	if (y > 0) {
		handStyle.height = Math.max((this.handHeight + offset), 25) + 'px';
		handStyle.top = '0px';
	} else if (diff > 0) {
		handStyle.height = Math.max((this.handHeight - diff), 25) + 'px';
		handStyle.bottom = '0px';
		handStyle.top = 'auto';
	} else {
		handStyle.height = this.handHeight + 'px';
		handStyle.top = offset + 'px';
	}
};

Scrollbar.prototype.redraw = function() {

	this.el.style.display = this.main.height < this.page.height ? 'block' : 'none';

	this.height = this.el.offsetHeight;
	this.handHeight = Math.round(Math.max(this.main.height / this.page.height * this.height, 25));
	this.ratio = (this.page.height - this.main.height) / (this.height - this.handHeight);
	
	this.y(this._y || 0);
};

Scrollbar.prototype.destroy = function() {
	var pn = this.el.parentNode;
	if (pn) pn.removeChild(this.el);
};


function Signal() {
	this.c = [];
}

Signal.prototype.on = function(fn, c) {
	this.c.push({fn: fn, c: c});
	return this;
};

Signal.prototype.fire = function() {
	var args = [].slice.call(arguments);
	for (var i = 0; i < this.c.length; i++) {
		this.c[i].fn.apply(this.c[i].c || this, args);
	}
	return this;
};

Signal.prototype.off = function(fn) {
	if (fn) {
		for (var i = 0; i < this.c.length; i++) {
			if (this.c[i] === fn) {
				this.c.splice(i, 1);
				i--;
			}
		}
	} else {
		this.c = [];
	}
	return this;
};


function TouchController(main, page) {
	this.main = main;
	this.page = page;

	this.x = 0;
	this.y = 0;
	main.events.scroll.on(function(y) { this.y = parseFloat(y); }, this);
	
	_.on(page.el, 'touchstart', this);
}

TouchController.prototype.handleEvent = function(e) {
	this[e.type](e);
};

TouchController.prototype.touchstart = function(e) {
	if (this.main.height < this.page.height) {
		this.moved = false;

		this.startX = e.touches[0].pageX - this.x;
		this.startY = e.touches[0].pageY - this.y;

		_.on(this.page.el, 'touchmove', this);
		_.on(this.page.el, 'touchend', this);
	}
};

TouchController.prototype.touchmove = function(e) {
	this.lastX = this.x;
	this.lastY = this.y;
	this.x = e.touches[0].pageX - this.startX;
	this.y = e.touches[0].pageY - this.startY;

	if (e.touches.length === 1 && Math.abs(this.y - this.lastY) > Math.abs(this.x - this.lastX)) {
		e.preventDefault();

		this.moved = true;
		this.lastMoveTime = +new Date();
		this.page.morph.set('y', this.y);
	}
};

TouchController.prototype.touchend = function(e) {
	_.off(this.page.el, 'touchmove', this);
	_.off(this.page.el, 'touchend', this);

	if (this.moved) {
		e.preventDefault();

		var delta = this.y - this.lastY;
		var dt = new Date() - this.lastMoveTime + 1;
		
		this.y = this.y + delta * 200 / dt;

		var dur = this.clampY() ? 500 : 1000;
		this.page.morph
			.duration(dur)
			.to('y', this.y)
			.ease('cubic-bezier(0,0,0.2,1)')
			.start();
	}
};

TouchController.prototype.clampY = function() {
	if (this.y >= 0) {
		this.y = 0;
		return true;
	} else if (this.y < this.main.height - this.page.height) {
		this.y = this.main.height - this.page.height;
		return true;
	}
};

TouchController.prototype.destroy = function() {
	_.off(this.page.el, 'touchstart', this);
};
})(window, document);