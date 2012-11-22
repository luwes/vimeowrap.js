/** @license
 * Vimeo Wrap - Lights Out plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/06/08)
 */

(function(base) {
	
	base.lightsout = function(api, config) {
		var _this = this;
		var shade, lights;
		
		var options = {
			backgroundcolor:		'000000',
			opacity:				0.8,
			time:					800,
			onplay:					'off',
			onpause:				'on',
			onfinish:				'on',
			parentid:				null
		};

		config = base.utils.extend(options, config);
		this.config = config;

		this.setup = function() {
			
			shade = document.createElement('div');
			shade.className += " lightsout_shade";
			shade.style.display = "none";
			shade.style.backgroundColor = "#" + config.backgroundcolor;
			shade.style.zIndex = 300;
			shade.style.opacity = 0;
			shade.style.filter = "alpha(opacity=0)";
			shade.style.top = 0;
			shade.style.left = 0;
			shade.style.bottom = 0;
			shade.style.right = 0;
			if (config.parentid) {
				shade.style.position = "absolute";
				document.getElementById(config.parentid).style.position = "relative";
				document.getElementById(config.parentid).appendChild(shade);
			} else {
				shade.style.position = "fixed";
				document.body.appendChild(shade);
			}

			shade.onclick = turnOn;
			
			lights = new base.lightsout.Fade(shade, config.time, config.opacity, sortPlayers);
			this.on = lights.on;
			this.off = lights.off;
			this.toggle = lights.toggle;

			api.events.playerReady.add(function(player) {
				api.onPlay(onPlay);
				api.onPause(onPause);
				api.onFinish(onFinish);
			});
		};

		function turnOn() {
			api.pause();
			lights.on();
		}

		function onPlay() {
			if (config.onplay == 'off') lights.off();
			else lights.on();
		}

		function onPause() {
			if (config.onpause == 'off') lights.off();
			else lights.on();
		}

		function onFinish() {
			if (config.onfinish == 'off') lights.off();
			else lights.on();
		}

		function sortPlayers() {
			var players = vimeowrap.getPlayers();
			for (var key in players) {
				players[key].display.style.zIndex = "auto";
			}
			api.display.style.zIndex = 301;
		}
	};
	
})(vimeowrap);
