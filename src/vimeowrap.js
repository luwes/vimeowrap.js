/** @license
 * Vimeo Wrap
 *
 * Author: Wesley Luyten
 * Version: 1.1 - (2012/06/07)
 */

(function(window) {

	var players = {};
	var vimeowrap = function(identifier) {

		var container;
		if (identifier.nodeType) {
			// Handle DOM Element
			container = identifier;
		} else if (typeof identifier === "string") {
			// Find container by ID
			container = document.getElementById(identifier);
		}
		
		if (container) {
			var foundPlayer = players[container.id];
			if (foundPlayer) {
				return foundPlayer;
			} else {
				return players[container.id] = new vimeowrap.api(container);
			}
		}
		return null;
	};

	vimeowrap.api = function(container) {
		var _this = this,
			playlist = null,
			config = null;
		
		this.container = container;
		this.id = container.id;
		this.display = null;
		this.iframe = null;
		this.player = null;
		this.config = null;
		this.plugins = {};

		this.events = {
			playerReady: new vimeowrap.signal(),
			playlist: new vimeowrap.signal(),
			playlistItem: new vimeowrap.signal()
		};

		this.setup = function(c) {
		
			var options = {
				width: 480,
				height: 280,
				color: "00adef",
				repeat: "none",
				item: 0,
				api: true,
				player_id: vimeowrap.utils.uniqueId('player_')
			};

			config = vimeowrap.utils.extend(options, c);
			this.config = config;

			reset();
			
			var height = config.height;
			var displayTop = 0;
			for (var key in config.plugins) {
				if (typeof vimeowrap[key] === "function") {
					this.plugins[key] = new vimeowrap[key](this, config.plugins[key]);
					
					this.plugins[key].config['y'] = height;
					height += this.plugins[key].config['height'] || 0;
					if (this.plugins[key].config['position'] === "top") {
						this.plugins[key].config['y'] = displayTop;
						displayTop += this.plugins[key].config['height'];
					}

					this.plugins[key].setup();
				}
			}
			
			vimeowrap.utils.css(this.container, {
				width: config.width,
				height: height
			});

			vimeowrap.utils.css(this.display, {
				top: displayTop
			});
			
			this.events.playlist.add(playlistLoaded);
			var loader = new vimeowrap.playlistloader(this);
			loader.load(config.urls);

			return this;
		};

		function playlistLoaded(p) {
			playlist = p;

			var item = playlist[config.item];
			_this.events.playlistItem.dispatch(item);

			embed(item.url);
		}
		
		function reset() {
			_this.container.innerHTML = "";
			vimeowrap.utils.css(_this.container, {
				position: 'relative'
			});
			
			_this.display = document.createElement('div');
			_this.display.id = _this.id + "_display";
			_this.container.appendChild(_this.display);
			vimeowrap.utils.css(_this.display, {
				width: config.width,
				height: config.height,
				position: 'absolute',
				background: '#000000'
			});
		}
		
		function embed(url) {

			vimeowrap.utils.jsonp('http://vimeo.com/api/oembed.json', getEmbedArgs({ url:url }), function(json) {

				var temp = document.createElement('div');
				temp.innerHTML = json.html;
				_this.iframe = temp.children[0];
				_this.iframe.id = config.player_id;
				vimeowrap.utils.css(_this.iframe, {
					position: 'absolute',
					display: 'none'
				});

				var showPlayer = function() {
					vimeowrap.utils.css(_this.iframe, {
						display: 'block'
					});
				};
				if (_this.iframe.attachEvent) {
					_this.iframe.attachEvent("onload", showPlayer);
				} else {
					_this.iframe.onload = showPlayer;
				}
				
				vimeowrap.utils.prepend(_this.iframe, _this.display);
						
				vimeowrap.Froogaloop(_this.iframe.id).addEvent('ready', function() {

					_this.player = vimeowrap.Froogaloop(_this.iframe.id);
					_this.events.playerReady.dispatch(_this.player);

					_this.player.addEvent('finish', playerFinish);
				});
			});
		}
		
		function getEmbedArgs(args) {
		
			var allowed = [	'url', 'width', 'maxwidth', 'height', 'maxheight', 'byline',
							'title', 'portrait', 'color', 'callback', 'autoplay', 'loop',
							'xhtml', 'api', 'wmode', 'iframe', 'player_id'];

			for (var i = 0; i < allowed.length; i++) {
				var key = allowed[i];
				if (config.hasOwnProperty(key)) {
					args[key] = config[key];
				}
			}
			
			return args;
		}

		function playerFinish(data) {
			var index;
			switch (config.repeat) {
				case "list":
					index = config.item + 1;
					if (index < playlist.length) {
						_this.playlistItem(index, true);
					}
					break;
				case "always":
					index = config.item + 1;
					if (index >= playlist.length) {
						index = 0;
					}
					_this.playlistItem(index, true);
					break;
				case "single":
					_this.play();
					break;
			}
		}
		
		this.playlistItem = function(index, autoplay) {
			
			config.item = index;

			this.pause();
			vimeowrap.utils.css(this.iframe, {
				display: 'none'
			});

			if (typeof autoplay === "boolean") {
				config.autoplay = autoplay;
			}
			
			var item = playlist[index];
			var url = 'http://player.vimeo.com/video/' + item.id + '?';
			var allowed = [	'byline', 'title', 'portrait', 'color',
							'autoplay', 'loop', 'api', 'player_id'];

			for (var i = 0; i < allowed.length; i++) {
				var key = allowed[i];
				if (config.hasOwnProperty(key)) {
					var value = config[key];
					if (typeof value === "boolean") value = value ? 1 : 0;
					url += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
				}
			}
			
			if (this.iframe) {
				this.iframe.src = url.slice(0, -1);
			}

			this.events.playlistItem.dispatch(item);
		};
		
		this.play = function() {
			if (this.player) {
				this.player.api('paused', function(paused, player_id) {
					if (paused === true) _this.player.api('play');
				});
			}
		};

		this.pause = function() {
			if (this.player) {
				this.player.api('paused', function(paused, player_id) {
					if (paused === false) _this.player.api('pause');
				});
			}
		};

		this.onPlay = function(func) {
			if (this.player) this.player.addEvent('play', func);
		};

		this.onPause = function(func) {
			if (this.player) this.player.addEvent('pause', func);
		};

		this.onFinish = function(func) {
			if (this.player) this.player.addEvent('finish', func);
		};

		this.getPlugin = function(key) {
			return this.plugins[key];
		};
	};

	window.vimeowrap = vimeowrap;

})(window);
