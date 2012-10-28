/** @license
 * Vimeo Wrap - Playlist plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/09/02)
 */

(function(base) {
	
	base.playlist = function(api, config) {
		var _this = this;

		var div;
		var list;
		
		var options = {
			backgroundcolor: '000000',
			position: 'bottom',
			width: api.config.width,
			height: 200,
			offsetx: 0,
			offsety: 0,
			autoplay: false,
			template: '<a href="#vimeo.com/{{id}}" title="{{title}}"><img src="{{thumbnail_' + (config.thumb && config.thumb.quality ? config.thumb.quality : "small") + '}}" alt="" /><span>{{title}}</span></a>',
			style: '',
			thumb: {
				width: 40,
				height: 30
			}
		};

		config = base.utils.extend(options, config);
		this.config = config;

		this.setup = function() {
			
			var style = "#{{id}} {}" +
						"#{{id}} a {text-decoration:none;}" +
						"#{{id}} a:active, #{{id}} a:focus {outline:none;}" +
						"#{{id}} {font:bold 12px/14px helvetica,arial,sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);}" +
						"#{{id}} ul {margin:0;padding:0;}" +
						"#{{id}} ul li {clear:both;display:block;width:100%;line-height:14px;}" +
						"#{{id}} ul li a {display:block;color:#{{color}};padding:5px 0;}" +
						"#{{id}} ul li a img {border:none;float:left;width:{{thumb_width}}px;height:{{thumb_height}}px;}";

			if ('ontouchstart' in window) {
				style += "#{{id}} ul li a.pressed {color:#F75342;}";
			} else {
				style += "#{{id}} ul li a:hover {color:#F75342;}";
			}
			
			style += config.style;

			var rules = document.createTextNode(style.populate({
				id: api.id + "_playlist",
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
			div.id = api.id + "_playlist";
			api.container.appendChild(div);
			base.utils.css(div, {
				width: config.width,
				height: config.height,
				position: 'absolute',
				left: config.x,
				top: config.y
			});
			new base.carousel.NoClickDelay(div);

			var wrap = document.createElement('div');
			wrap.id = div.id + "_wrap";
			div.appendChild(wrap);
			base.utils.css(wrap, {
				backgroundColor: '#' + config.backgroundcolor,
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
			base.utils.css(list, {
				height: config.height,
				position: 'absolute',
				'list-style': 'none'
			});

			api.events.playlist.add(_parse);
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
			
			var list = document.getElementById(div.id+'_list');
			list.innerHTML = html.join('');
		}

	};
	
})(vimeowrap);
