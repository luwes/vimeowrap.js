/** @license
 * Vimeo Wrap - Lights Out plugin
 *
 * Author: Wesley Luyten
 * Version: 1.0 - (2012/06/08)
 */

(function(vimeo) {
	
	vimeo.lightsout = function(api, config) {
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

		config = vimeo.utils.extend(options, config);
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
			
			lights = new vimeo.lightsout.Fade(shade, config.time, config.opacity);

			api.display.style.zIndex = 301;

			api.events.froogaloopReady.add(function(f) {
				f.addEvent('play', onPlay);
				f.addEvent('pause', onPause);
				f.addEvent('finish', onFinish);
			});
		};

		function turnOn() {
			api.pause();
			lights.on();
		}

		function onPlay(player_id) {
			if (config.onplay == 'off') lights.off();
			else lights.on();
		}

		function onPause(player_id) {
			if (config.onpause == 'off') lights.off();
			else lights.on();
		}

		function onFinish(player_id) {
			if (config.onfinish == 'off') lights.off();
			else lights.on();
		}

	};
	
})(vimeowrap);
