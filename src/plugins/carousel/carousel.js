/** @license
 * Vimeo Wrap - Carousel plugin
 *
 * Author: Wesley Luyten
 * Version: 0.1 - (2012/03/18)
 */

(function(vimeo) {
	
	vimeo.carousel = function(api, config) {
		var _this = this;
		var _playlist = null;
		
		this.config = config;
		this.x = 0;
		this.visible = 0;
		this.position = 0;
		this.offset = 0;
		this.length = 0;
		TWEEN.start();

		var div;
		var list;

		var options = {
			position: 'bottom',
			width: api.config.width,
			height: 130,
			offsetx: 50,
			offsety: 10,
			autoplay: false,
			template: '<div><a href="#vimeo.com/{{id}}" title="{{title}}"><img src="{{thumbnail|' + (config.thumb && config.thumb.quality ? config.thumb.quality : "small") + '}}" alt="" /><span>{{title}}</span></a></div>',
			easing: TWEEN.Easing.Exponential.EaseInOut,
			speed: 250,
			thumb: {
				width: 100,
				height: 75
			}
		};

		this.setup = function() {

			config = vimeo.utils.extend(options, config);
			
			var style = "@font-face {font-family:'Pictish'; src:url('fonts/pictish.eot'); src:url('fonts/pictish.eot?#iefix') format('embedded-opentype'), url('fonts/pictish.woff') format('woff'), url('fonts/pictish.ttf') format('truetype'), url('fonts/pictish.svg#PictishRegular') format('svg'); font-weight:normal; font-style:normal;}" +
						"#{{id}} a {text-decoration:none;}" +
						"#{{id}} a:active, #{{id}} a:focus {outline:none;}" +
						"#{{id}} {font:bold 12px/14px helvetica,arial,sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);}" +
						"#{{id}} ul li {overflow:hidden;text-align:center;}" +
						"#{{id}} ul li a {color:#{{color}};}" +
						"#{{id}} ul li a img {border:none;width:{{thumb_width}}px;height:{{thumb_height}}px;}" +
						
						"#{{id}}_navleft, #{{id}}_navright {color:#000;display:block;font-family:'Pictish';font-size:19px;position:absolute;top:32px;width:20px;height:19px;padding:10px;}" +
						"#{{id}}_navright {right:0;}";

			if ('ontouchstart' in window) {
				style += "#{{id}} ul li a.pressed {color:#F75342;}" +
						"#{{id}}_navleft.pressed, #{{id}}_navright.pressed {color:#{{color}};}";
			} else {
				style += "#{{id}} ul li a:hover {color:#F75342;}" +
						"#{{id}}_navleft:hover, #{{id}}_navright:hover {color:#{{color}};}";
			}
			
			style += config.style;

			var rules = document.createTextNode(style.populate({
				id: api.id + "_carousel",
				color: api.config.color,
				'thumb_width': config.thumb.width,
				'thumb_height': config.thumb.height
			}));

			var styleElement = document.createElement('style');
			styleElement.type = "text/css";
			//styleElement must be added to head before setting cssText, IE font-face
			document.getElementsByTagName('head')[0].appendChild(styleElement);
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = rules.nodeValue;
			} else {
				styleElement.appendChild(rules);
			}
			
			div = document.createElement('div');
			div.id = api.id + "_carousel";
			api.container.appendChild(div);
			vimeo.utils.css(div, {
				width: config.width,
				height: config.height,
				position: 'absolute',
				left: config.x,
				top: config.y
			});
			new vimeo.carousel.NoClickDelay(div);
			
			var wrap = document.createElement('div');
			wrap.id = div.id + "_wrap";
			div.appendChild(wrap);
			vimeo.utils.css(wrap, {
				width: config.width - config.offsetx * 2,
				height: config.height - config.offsety,
				overflow: 'hidden',
				position: 'absolute',
				left: config.offsetx,
				top: config.offsety
			});
			
			list = document.createElement('ul');
			list.id = div.id + "_list";
			wrap.appendChild(list);
			vimeo.utils.css(list, {
				height: config.height,
				position: 'absolute',
				'list-style-type': 'none',
				margin: 0,
				padding: 0
			});
			list.onclick = _loadOnClick;

			var navleft = document.createElement('a');
			navleft.id = div.id + "_navleft";
			navleft.href = "#left";
			navleft.innerHTML = "<span>[</span>";
			div.appendChild(navleft);
			navleft.onclick = this.left;

			var navright = document.createElement('a');
			navright.id = div.id + "_navright";
			navright.href = "#right";
			navright.innerHTML = "<span>]</span>";
			div.appendChild(navright);
			navright.onclick = this.right;
			
			api.events.playlistAllLoaded.add(_parse);
		};
		
		function _parse(playlist) {
			
			_playlist = playlist;
			_this.length = playlist.length;
			
			var html = [];
			var template = config.template;
			for (var i = 0; i < playlist.length; i++) {
				html.push('<li>');
				html.push(template.populate(playlist[i]));
				html.push('</li>');
			}
			
			var listWidth = config.width - config.offsetx * 2;
			_this.visible = config.visible > 0 ? config.visible : Math.floor(listWidth / config.thumb.width);
			var marginRight = (listWidth - _this.visible * config.thumb.width) / Math.max(_this.visible-1, 1);
			
			var list = document.getElementById(div.id+'_list');
			list.innerHTML = html.join('');
			
			var elements = list.getElementsByTagName('li');
			for (i = 0; i < elements.length; i++) {
			
				var li = elements[i];
				vimeo.utils.css(li, {
					styleFloat: 'left',
					cssFloat: 'left',
					width: config.thumb.width,
					marginRight: marginRight
				});
			}
			
			vimeo.utils.css(list, {
				width: playlist.length * (config.thumb.width + marginRight)
			});

			_this.offset = config.thumb.width + marginRight;
		}
		
		function _loadOnClick(e) {
			// Event tweaks, since IE wants to go its own way...
			var event = e || window.event;
			var target = event.target || event.srcElement;

			if (target && target.nodeName.toLowerCase() !== "li") {
				while (target) {
					target = target.parentNode;
					if (target.nodeName.toLowerCase() === "li") break;
				}
			}
			
			var index = 0;
			var children = target.parentNode.children;
			for (var i = 0; i < children.length; i++) {
				index = i;
				if (children[i] === target) break;
			}
			
			api.load(_playlist[index], config.autoplay);
			return false;
		}

		this.left = function(e) {
			if (_this.position > 0) {
				_this.to(_this.position-_this.visible);
			}
			return false;
		};

		this.right = function(e) {
			if (_this.position < _this.length - _this.visible) {
				_this.to(_this.position+_this.visible);
			}
			return false;
		};

		this.to = function(pos) {
			_this.position = pos;
			new TWEEN.Tween(_this)
				.to({ x:-pos*_this.offset }, config.speed)
				.onUpdate(move)
				.easing(config.easing)
				.start();
			return false;
		};

		function move() {
			list.style.left = _this.x + "px";
		}
	};
	
})(vimeowrap);
