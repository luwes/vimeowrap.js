# vimeowrap.js

vimeowrap is a easy to use Vimeo player embedder that can be extended with plugins.

## Features
* Uses oEmbed so the embed code is always up to date
* Playlist support, play videos one after another
* Extendable with plugins

## Usage
``` html
<div id="player"></div>
<script src="http://luwes.co/vimeowrap.js/vimeowrap.js"></script>
<script>
	vimeowrap('player').setup({
		urls: [
			'https://vimeo.com/user3709818'
		]
	});
</script>