# Deprecated!

See https://github.com/playerxo/playerx for the evolution of this project!

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
<script src="https://luwes.github.io/vimeowrap.js/vimeowrap.js"></script>
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
<script src="https://luwes.github.io/vimeowrap.js/vimeowrap.js"></script>
<script src="https://luwes.github.io/vimeowrap.js/vimeowrap.carousel.js"></script>
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
	<th>parameter</th>
	<th>default</th>
	<th>description</th>
</tr></thead>
<tbody>
	<tr>
		<th>urls</th>
		<td></td>
		<td>(required) Array with the Vimeo URL's. User or video URL's are supported.</td>
	</tr>
	<tr>
		<th>width</th>
		<td>480</td>
		<td>Width of the Vimeo player.</td>
	</tr>
	<tr>
		<th>height</th>
		<td>280</td>
		<td>Height of the Vimeo player.</td>
	</tr>
	<tr>
		<th>autoplay</th>
		<td>false</td>
		<td>Automatically start playback of the video. Note that this won’t work on some devices.</td>
	</tr>
	<tr>
		<th>repeat</th>
		<td>none</td>
		<td>
			What to do when the video has ended.<br/>
			<b>none</b>: stop playback when a video is completed.<br/>
			<b>list</b>: play each video in the playlist once, stop at the end.<br/>
			<b>always</b>: continously play the video (or all videos in the playlist).<br/>
			<b>single</b>: continously repeat the current video in the playlist.
		</td>
	</tr>
	<tr>
		<th>item</th>
		<td>0</td>
		<td>Use this to load the player with a specific playlist item instead of the first item.</td>
	</tr>
	<tr>
		<th>plugins</th>
		<td></td>
		<td>Object with plugins. Plugins are seperate javascript files that extend the functionality of vimeowrap.</td>
	</tr>
	<tr>
		<th>color</th>
		<td>00adef</td>
		<td>Specify the color of the video controls.</td>
	</tr>
	<tr>
		<th>byline</th>
		<td>true</td>
		<td>Show the byline on the video.</td>
	</tr>
	<tr>
		<th>title</th>
		<td>true</td>
		<td>Show the title on the video.</td>
	</tr>
	<tr>
		<th>portrait</th>
		<td>true</td>
		<td>Show the user's portrait on the video.</td>
	</tr>
	</tbody>
</table>
