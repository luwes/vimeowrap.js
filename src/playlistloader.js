(function(base) {
	
	base.playlistloader = function(playerApi) {
		var _this = this;
		var index = 0;
		var playlist = [];

		this.load = function(arr) {
			_this.list = convert(arr);
			load();
			return playlist;
		};
		
		function convert(arr) {
			for (var i = 0; i < arr.length; i++) {
				var apiV2 = "vimeo.com/api/v2/";
				arr[i] = arr[i].replace(/vimeo.com\/(\d+)$/i, apiV2 + 'video/$1.json');
				arr[i] = arr[i].replace(/vimeo.com\/([A-Z0-9]+)([\?A-Z0-9=]*)$/i, apiV2 + '$1/videos.json$2');
				arr[i] = arr[i].replace(/vimeo.com\/groups\/([A-Z0-9]+)([\?A-Z0-9=]*)$/i, apiV2 + 'group/$1/videos.json$2');
				arr[i] = arr[i].replace(/vimeo.com\/channels\/([A-Z0-9]+)([\?A-Z0-9=]*)$/i, apiV2 + 'channel/$1/videos.json$2');
				arr[i] = arr[i].replace(/vimeo.com\/album\/([A-Z0-9]+)([\?A-Z0-9=]*)$/i, apiV2 + 'album/$1/videos.json$2');
			}
			return arr;
		}
		
		function load() {
			base.utils.jsonp(_this.list[index++], {}, loaded);
		}
		
		function loaded(json) {
		
			playlist = playlist.concat(json);

			if (index < _this.list.length) {
				load();
			} else {
				playerApi.events.playlist.dispatch(playlist);
				playerApi.events.playlist.remove();
			}
		}
	};
	
})(vimeowrap);
