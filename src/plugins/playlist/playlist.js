/** @license
 * Vimeo Wrap - Playlist plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0.0 - (2012/09/02)
 *			1.0.1 - (2014/02/05)
 */

vimeowrap.playlist = function(api, config) {
	var _this = this;

	var div;
	var list;
	var scroller;
	
	var options = {
		position: 'bottom',
		size: 200,
		offsetx: 2,
		offsety: 2,
		autoplay: false,
		template: '',
		style: '',
		thumb: {
			width: 80,
			height: 60
		}
	};

	options.template =
		'<a href="{{url}}" title="{{title}}">' +
			'<span class="shade"></span>' +
			'<span class="border"></span>' +
			'<img src="{{thumbnail_' + (config.thumb && config.thumb.quality ? config.thumb.quality : "small") + '}}" alt="" />' +
			'<span class="title">{{title|truncate:30}}</span>' +
			'<span class="byline">from <b>{{user_name}}</b> ' +
				'<time datetime="{{upload_date}}">{{upload_date|timesince}} ago</time>' +
			'</span>' +
			'<span class="desc">{{description|striptags|truncate:50}}</span>' +
			'<span class="duration">{{duration|time}}</span>' +
		'</a>';

	config = vimeowrap.utils.extend(options, config);
	this.config = config;

	this.setup = function() {
		
		var style = [
			'#{{id}} {background-color:#000; color:#fff; font:normal 12px/14px helvetica,arial,sans-serif; -webkit-tap-highlight-color:rgba(0,0,0,0);}',
			'ul {list-style:none; margin:0; padding:0 9px 0 0;}',
			'li {list-style:none; clear:both; display:block; height:{{thumb_height}}px; line-height:16px; margin:0 0 2px; padding:0; overflow:hidden;}',
			'li:last-child {margin:0;}',
			'li.selected {opacity:.4; filter:alpha(opacity=40);}',
			'li:nth-child(odd) > a {background-color:rgba(255,255,255,.07);}',
			'li > a {display:block; position:relative; height:{{thumb_height}}px; text-decoration:none;}',
			'a:active, #{{id}} a:focus {outline:none;}',
			'span {color:#fff; display:block;}',
			'.shade {position:absolute; top:0; right:0; bottom:0; left:0;}',
			'img {border:none; float:left; width:{{thumb_width}}px; height:{{thumb_height}}px; margin:0 7px 0 0;}',
			'.border {box-sizing:border-box; -moz-box-sizing:border-box; -webkit-box-sizing:border-box; position:absolute; left:0; top:0; border-right:rgba(255, 255, 255, .1) 1px solid; width:{{thumb_width}}px; height:{{thumb_height}}px;}',
			'.title {font-weight:bold; padding-top:5px; font-size:14px;}',
			'.byline {color:#9DA2A8;}',
			'.byline time {font-size:11px;}',
			'.desc {color:#71767A;}',
			'.duration {position:absolute; top:3px; right:7px;}'
		];

		if ('ontouchstart' in window) {
			style.push('li .pressed {background-color:rgba(255,255,255,0.15);}');
		} else {
			style.push('li > a:hover {background-color:rgba(255,255,255,0); text-decoration:none;}');
			style.push('li > a:hover .shade {background-color:rgba(255,255,255,0.15);}');
		}
		
		style = style.join(' #{{id}} ');
		style += config.style;

		var rules = document.createTextNode(style.populate({
			id: api.id + '_playlist',
			color: api.config.color,
			'thumb_width': config.thumb.width,
			'thumb_height': config.thumb.height
		}));

		var styleElement = document.createElement('style');
		styleElement.type = 'text/css';
		//styleElement must be added to head before setting cssText, IE font-face
		vimeowrap.utils.prepend(styleElement, document.getElementsByTagName('head')[0]);
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = rules.nodeValue;
		} else {
			styleElement.appendChild(rules);
		}
		
		div = document.createElement('div');
		div.id = api.id + '_playlist';
		api.container.appendChild(div);
		vimeowrap.utils.css(div, {
			width: this.width,
			height: this.height,
			position: 'absolute',
			left: this.x,
			top: this.y
		});

		var wrap = document.createElement('div');
		wrap.id = div.id + '_wrap';
		div.appendChild(wrap);
		vimeowrap.utils.css(wrap, {
			width: this.width - config.offsetx * 2,
			height: this.height - config.offsety * 2,
			position: 'absolute',
			left: config.offsetx,
			top: config.offsety
		});
		
		list = document.createElement('ul');
		list.id = div.id + '_list';
		wrap.appendChild(list);
		vimeowrap.utils.css(list, {
			position: 'absolute',
			left: 0,
			right: 0
		});
		list.onclick = loadOnClick;

		scroller = new SkinnyScroll(wrap);

		api.events.playlist.add(parse);
		api.events.playlistItem.add(selectItem);
	};
	
	function parse(playlist) {
		
		_this.length = playlist.length;

		var mods = {
			striptags: function(str) {
				return str.replace(/<\/?.*?>/g, '');
			},
			truncate: function(str, len) {
				if (str.length > len) {
					str = str.slice(0, len) + '...';
				}
				return str;
			},
			timesince: function(str) {
				var tim = new Date(str.replace(/-/g, '/')).getTime();
				var obj = { second: (new Date().getTime() - tim) / 1000 };
				var lbl = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
				var num = [1, 60, 60, 24, 7, 4.34812, 12];
				for (var i = 1; i < lbl.length; i++) {
					obj[lbl[i]] = obj[lbl[i-1]] / num[i];
					if (obj[lbl[i-1]] < num[i]) {
						str = Math.floor(obj[lbl[i-1]]);
						return str + ' ' + lbl[i-1] + (str === 1 ? '' : 's');
					}
				}
				str = Math.floor(obj[lbl[i-1]]);
				return str + ' ' + lbl[i-1] + (str === 1 ? '' : 's');
			},
			time: function(secs) {
				var h = Math.floor(secs / 3600);
				var m = Math.floor((secs % 3600) / 60);
				var s = Math.floor((secs % 3600) % 60);
				return (h===0 ? '' : h+':')+m+':'+(s<10 ? '0'+s : s);
			}
		};
		
		var html = [];
		var template = config.template;
		for (var i = 0; i < playlist.length; i++) {
			html.push('<li>');
			html.push(template.populate(playlist[i], mods));
			html.push('</li>');
		}
		
		var list = document.getElementById(div.id+'_list');
		list.innerHTML = html.join('');

		scroller.redraw();
	}

	function loadOnClick(e) {
		// Event tweaks, since IE wants to go its own way...
		var event = e || window.event;
		var target = event.target || event.srcElement;

		if (target && target.nodeName.toLowerCase() !== 'li') {
			while (target) {
				target = target.parentNode;
				if (target.nodeName.toLowerCase() === 'li') break;
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

	function selectItem(item, index) {
		var lis = list.children;
		for (var i = 0; i < lis.length; i++) {
			lis[i].className = lis[i].className.replace(/ ?selected/gi, '');
		}
		lis[index].className += ' selected';
	}
};
