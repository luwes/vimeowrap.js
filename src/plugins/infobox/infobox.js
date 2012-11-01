/** @license
 * Vimeo Wrap - Info Box plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/10/27)
 */
    
(function(base) {
	
	base.infobox = function(api, config) {
		var _this = this;
		
		var options = {
			position: 'bottom',
			width: api.config.width,
			height: 130,
			template: '<div class="infobox"><a href="{{user_url}}"><img class="portrait" src="{{user_portrait_medium}}"/></a><div class="title"><a href="{{url}}" title="{{title}}">{{title|truncate:20}}</a></div><div class="byline">from <a href="{{user_url}}">{{user_name}}</a> <time datetime="{{upload_date}}">{{upload_date|timesince}} ago</time></div><p class="desc">{{description|truncate:100}}</p></div>',
			style: ''
		};

		config = base.utils.extend(options, config);
		this.config = config;

		this.setup = function() {
			
			var style = "#{{id}} { background-color:#F4F5F7; border:1px solid #E9EBEF; overflow:hidden; }" +
						"#{{id}} a { color: #{{color}}; text-decoration:none; }" +
						"#{{id}} a:hover { color:#F75342; }" +
						"#{{id}} .infobox { font:normal 14px helvetica,arial,sans-serif; padding:10px; }" +
						"#{{id}} .portrait { border:1px solid #E1E2E3; background-color:#fff; float:left; padding:2px; margin:0 10px 13px 0; width:52px; height:52px; }" +
						"#{{id}} .title { font-size:30px; font-weight:700; }" +
						"#{{id}} .byline a { color:#000; font-weight:700; }" +
						"#{{id}} .byline time { color:#9DA2A8; font-size:11px; }" +
						"#{{id}} .desc { clear:both; color:#71767A; font-size:16px; margin:0; }";
			style += config.style;

			var rules = document.createTextNode(style.populate({
				id: api.id + "_infobox",
				color: api.config.color
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
			div.id = api.id + "_infobox";
			api.container.appendChild(div);
			base.utils.css(div, {
				width: config.width,
				height: config.height,
				position: 'absolute',
				left: config.x,
				top: config.y
			});

			api.events.playlistItem.add(update);
		};

		function update(item) {

			div.innerHTML = config.template.populate(item, {

				truncate: function(str, len) {
					if (str.length > len) {
						str = str.slice(0, len) + "...";
					}
					return str;
				},

				timesince: function(str) {

					var obj = { second: (new Date().getTime() - new Date(str).getTime()) / 1000 };
					var lbl = ["second", "minute", "hour", "day", "week", "month", "year"];
					var num = [1, 60, 60, 24, 7, 4.34812, 12];
					for (var i = 1; i < lbl.length; i++) {
						obj[lbl[i]] = obj[lbl[i-1]] / num[i];
						if (obj[lbl[i-1]] < num[i]) {
							str = Math.floor(obj[lbl[i-1]]);
							return str + " " + lbl[i-1] + (str === 1 ? "" : "s");
						}
					}
					str = Math.floor(obj[lbl[i-1]]);
					return str + " " + lbl[i-1] + (str === 1 ? "" : "s");
				}

			});
		}
	};
	
})(vimeowrap);
