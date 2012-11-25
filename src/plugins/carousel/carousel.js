/** @license
 * Vimeo Wrap - Carousel plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/03/18)
 * Version: 1.1 - (2012/11/23)
 */

(function(base) {
	
	base.carousel = function(api, config) {
		var _this = this;

		var div;
		var list;
		
		var options = {
			position: 'bottom',
			size: 130,
			offsetx: 50,
			offsety: 10,
			autoplay: false,
			template: '<a href="{{url}}" title="{{title}}"><img src="{{thumbnail_' + (config.thumb && config.thumb.quality ? config.thumb.quality : "small") + '}}" alt="" /><span>{{title}}</span></a>',
			style: '',
			easing: TWEEN.Easing.Exponential.EaseInOut,
			speed: 250,
			thumb: {
				width: 100,
				height: 75
			}
		};

		config = base.utils.extend(options, config);
		this.config = config;
		this.xx = 0;
		this.visible = 0;
		this.position = 0;
		this.offset = 0;
		this.length = 0;
		TWEEN.start();

		this.setup = function() {
			
			var fontdir = config.fontdir || "http://luwes.co/vimeowrap.js/fonts/";
			var style = "@font-face {font-family:'Pictish'; src:url('" + fontdir + "pictish.eot'); src:url('" + fontdir + "pictish.eot?#iefix') format('embedded-opentype'), " +
						"url(data:application/x-font-woff;charset=utf-8;base64,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) format('woff'), " +
						"url('" + fontdir + "pictish.ttf') format('truetype'), url('" + fontdir + "pictish.svg#PictishRegular') format('svg'); font-weight:normal; font-style:normal;}" +
						"#{{id}} a {text-decoration:none;}" +
						"#{{id}} a:active, #{{id}} a:focus {outline:none;}" +
						"#{{id}} {font:bold 12px/14px helvetica,arial,sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);}" +
						"#{{id}} ul {margin:0;padding:0;}" +
						"#{{id}} ul li {display:block;float:left;width:{{thumb_width}}px;line-height:14px;}" +
						"#{{id}} ul li a {display:block;color:#{{color}};text-align:center;}" +
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
			base.utils.prepend(styleElement, document.getElementsByTagName('head')[0]);
			if (styleElement.styleSheet) {
				styleElement.styleSheet.cssText = rules.nodeValue;
			} else {
				styleElement.appendChild(rules);
			}
			
			div = document.createElement('div');
			div.id = api.id + "_carousel";
			api.container.appendChild(div);
			base.utils.css(div, {
				width: this.width,
				height: this.height,
				position: 'absolute',
				left: this.x,
				top: this.y
			});
			new base.carousel.NoClickDelay(div);
			
			var wrap = document.createElement('div');
			wrap.id = div.id + "_wrap";
			div.appendChild(wrap);
			base.utils.css(wrap, {
				width: this.width - config.offsetx * 2,
				height: this.height - config.offsety,
				overflow: 'hidden',
				position: 'absolute',
				left: config.offsetx,
				top: config.offsety
			});
			
			list = document.createElement('ul');
			list.id = div.id + "_list";
			wrap.appendChild(list);
			base.utils.css(list, {
				height: this.height,
				position: 'absolute',
				'list-style': 'none'
			});
			list.onclick = loadOnClick;

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
			
			api.events.playlist.add(parse);
		};
		
		function parse(playlist) {
			
			_this.length = playlist.length;

			var listWidth = _this.width - config.offsetx * 2;
			_this.visible = config.visible > 0 ? config.visible : Math.floor(listWidth / config.thumb.width);
			var marginRight = Math.round((listWidth - _this.visible * config.thumb.width) / Math.max(_this.visible-1, 1));
			
			var html = [];
			var template = config.template;
			for (var i = 0; i < playlist.length; i++) {
				html.push('<li style="margin-right:' + marginRight + 'px;">');
				html.push(template.populate(playlist[i]));
				html.push('</li>');
			}
			
			var list = document.getElementById(div.id+'_list');
			list.innerHTML = html.join('');

			_this.offset = config.thumb.width + marginRight;
			base.utils.css(list, {
				width: playlist.length * _this.offset
			});
		}
		
		function loadOnClick(e) {
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
			
			if (index !== api.config.item) {
				api.playlistItem(index, config.autoplay);
			}
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
				.to({ xx:-pos*_this.offset }, config.speed)
				.onUpdate(move)
				.easing(config.easing)
				.start();
			return false;
		};

		function move() {
			list.style.left = _this.xx + "px";
		}
	};
	
})(vimeowrap);
