/** @license
 * Vimeo Wrap
 *
 * Author: Wesley Luyten
 * Version: 1.1 - (2012/06/07)
 */

(function(window) {

	var _players = {};
	var vimeowrap = function(identifier) {
		
		var _container;
		if (identifier.nodeType) {
			// Handle DOM Element
			_container = identifier;
		} else if (typeof identifier === "string") {
			// Find container by ID
			_container = document.getElementById(identifier);
		}
		
		if (_container) {
			var foundPlayer = _players[_container.id];
			if (foundPlayer) {
				return foundPlayer;
			} else {
				return _players[_container.id] = new vimeowrap.api(_container);
			}
		}
		return null;
	};

	vimeowrap.api = function(container) {
		var _this = this;
		var _playlist = null;
		
		this.container = container;
		this.id = container.id;
		this.display = null;
		this.iframe = null;
		this.player = null;
		this.config = null;
		this.plugins = {};

		this.setup = function(options) {
		
			var defaultConfig = {
				width: 480,
				height: 280,
				color: "00adef",
				repeat: "none",
				item: 0,
				api: true,
				player_id: vimeowrap.utils.uniqueId('player_')
			};
			_this.config = vimeowrap.utils.extend(defaultConfig, options);
			_reset();
			
			var height = _this.config.height;
			var displayTop = 0;
			for (var key in _this.config.plugins) {
				if (typeof vimeowrap[key] === "function") {
					_this.plugins[key] = new vimeowrap[key](_this, _this.config.plugins[key]);
					
					_this.plugins[key].config['y'] = height;
					height += _this.plugins[key].config['height'] || 0;
					if (_this.plugins[key].config['position'] === "top") {
						_this.plugins[key].config['y'] = displayTop;
						displayTop += _this.plugins[key].config['height'];
					}

					_this.plugins[key].setup();
				}
			}
			
			vimeowrap.utils.css(_this.container, {
				width: _this.config.width,
				height: height
			});

			vimeowrap.utils.css(_this.display, {
				top: displayTop
			});
			
			_this.events.playlist.add(_playlistLoaded);
			var loader = new vimeowrap.playlistloader(_this);
			loader.load(_this.config.urls);
		};

		function _playlistLoaded(playlist) {
			_playlist = playlist;
			_embed(playlist[_this.config.item].url);
		}
		
		function _reset() {
			_this.container.innerHTML = "";
			vimeowrap.utils.css(_this.container, {
				position: 'relative'
			});
			
			_this.display = document.createElement('div');
			_this.display.id = _this.id + "_display";
			_this.container.appendChild(_this.display);
			vimeowrap.utils.css(_this.display, {
				width: _this.config.width,
				height: _this.config.height,
				position: 'absolute',
				background: '#000000'
			});
		}
		
		function _embed(url) {

			vimeowrap.utils.jsonp('http://vimeo.com/api/oembed.json', _getEmbedArgs({ url:url }), function(json) {

				var temp = document.createElement('div');
				temp.innerHTML = json.html;
				_this.iframe = temp.children[0];
				_this.iframe.id = _this.config.player_id;
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

					_this.player.addEvent('finish', _playerFinish);
				});
			});
		}
		
		function _getEmbedArgs(args) {
		
			var allowed = [	'url', 'width', 'maxwidth', 'height', 'maxheight', 'byline',
							'title', 'portrait', 'color', 'callback', 'autoplay', 'loop',
							'xhtml', 'api', 'wmode', 'iframe', 'player_id'];

			for (var i = 0; i < allowed.length; i++) {
				var key = allowed[i];
				if (_this.config.hasOwnProperty(key)) args[key] = _this.config[key];
			}
			
			return args;
		}

		function _playerFinish(data) {
			var index;
			switch (_this.config.repeat) {
				case "list":
					index = _this.config.item + 1;
					if (index < _playlist.length) {
						_this.playlistItem(index, true);
					}
					break;
				case "always":
					index = _this.config.item + 1;
					if (index >= _playlist.length) {
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
			
			_this.config.item = index;

			_this.pause();
			vimeowrap.utils.css(_this.iframe, {
				display: 'none'
			});

			if (typeof autoplay === "boolean") {
				_this.config.autoplay = autoplay;
			}
			
			var item = _playlist[index];
			var url = 'http://player.vimeo.com/video/' + item.id + '?';
			var allowed = [	'byline', 'title', 'portrait', 'color',
							'autoplay', 'loop', 'api', 'player_id'];

			for (var i = 0; i < allowed.length; i++) {
				var key = allowed[i];
				if (_this.config.hasOwnProperty(key)) {
					var value = _this.config[key];
					if (typeof value === "boolean") value = value ? 1 : 0;
					url += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
				}
			}
			
			if (_this.iframe) {
				_this.iframe.src = url.slice(0, -1);
			}
		};
		
		this.play = function() {
			if (_this.player) {
				_this.player.api('paused', function(paused, player_id) {
					if (paused === true) _this.player.api('play');
				});
			}
		};

		this.pause = function() {
			if (_this.player) {
				_this.player.api('paused', function(paused, player_id) {
					if (paused === false) _this.player.api('pause');
				});
			}
		};

		this.onPlay = function(func) {
			if (_this.player) _this.player.addEvent('play', func);
		};

		this.onPause = function(func) {
			if (_this.player) _this.player.addEvent('pause', func);
		};

		this.onFinish = function(func) {
			if (_this.player) _this.player.addEvent('finish', func);
		};

		this.getPlugin = function(key) {
			return _this.plugins[key];
		};
		
		this.events = {
			playerReady: new vimeowrap.signal(),
			playlist: new vimeowrap.signal()
		};
	};

	window.vimeowrap = vimeowrap;

})(window);
