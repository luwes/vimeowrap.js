# vimeowrap.js

vimeowrap is an easy to use Vimeo player embedder that can be extended with plugins.

## Features
* Uses oEmbed so the embed code is always up to date
* Playlist support, play videos one after another
* Extendable with plugins

## Usage
### Basic
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
```

### Carousel Plugin
``` html
<div id="player"></div>
<script src="http://luwes.co/vimeowrap.js/vimeowrap.js"></script>
<script src="http://luwes.co/vimeowrap.js/vimeowrap.carousel.js"></script>
<script>
	vimeowrap('player').setup({
		urls: [
			'https://vimeo.com/user3709818'
		],
		plugins: {
			'carousel': {}
		}
	});
</script>
```

## Configuration
<table>
<thead><tr>
	<th>parameter</th> <th>default</th> <th>description</th>
</tr></thead>
<tbody>
	<tr>
		<th>width</th>
		<td>480</td>
		<td>Width of the vimeo player</td>
	</tr>
	<tr>
		<th>height</th>
		<td>280</td>
		<td>Height of the vimeo player</td>
	</tr>
	<tr>
		<th>color</th>
		<td>00adef</td>
		<td>Color of the vimeo player</td>
	</tr>
	<tr>
		<th>byline</th>
		<td>true</td>
		<td>Show the byline on the video</td>
	</tr>
	</tbody>
</table>