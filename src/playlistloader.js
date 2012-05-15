(function(vimeo) {
	
	vimeo.playlistloader = function(playerApi) {
		var _this = this;
		var _index = 0;
		var _playlist = [];

		this.load = function(arr) {
			_this.list = _convert(arr);
			var matches = _this.list[0].match(/vimeo.com\/api\/v2\/video\/(\d+)\.json$/);
			if (matches) {
				playerApi.events.playlistFirstLoaded.dispatch('http://vimeo.com/' + matches[1]);
				playerApi.events.playlistFirstLoaded.remove();
			}
			_load();
		};
		
		function _convert(arr) {
			for (var i=0; i < arr.length; i++) {
				arr[i] = arr[i].replace(/vimeo.com\/(\d+)$/i, 'vimeo.com/api/v2/video/$1.json');
				arr[i] = arr[i].replace(/vimeo.com\/([A-Z][A-Z0-9]+)$/i, 'vimeo.com/api/v2/$1/videos.json');
			}
			return arr;
		}
		
		function _load() {
			vimeo.utils.jsonp(_this.list[_index++], {}, _loaded);
		}
		
		function _loaded(json) {
		
			_playlist = _playlist.concat(json);
			if (_index === 1) {
				playerApi.events.playlistFirstLoaded.dispatch(_playlist[0].url);
				playerApi.events.playlistFirstLoaded.remove();
			}
			if (_index < _this.list.length) {
				_load();
			} else {
				playerApi.events.playlistAllLoaded.dispatch(_playlist);
				playerApi.events.playlistAllLoaded.remove();
			}
		}
	};
	
})(vimeowrap);
