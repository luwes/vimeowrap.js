#!/bin/sh

cd $(dirname $0)

uglifyjs2 src/vimeowrap.js \
	src/playlistloader.js \
	src/utils.js \
	src/signal.js \
	src/froogaloop.js \
	-o vimeowrap.js -m
	
# uglifyjs2 src/plugins/carousel/carousel.js \
# 	src/plugins/carousel/noclickdelay.js \
# 	src/plugins/carousel/Tween.js \
# 	-o vimeowrap.carousel.js -m
	
# uglifyjs2 src/plugins/lightsout/lightsout.js \
# 	src/plugins/lightsout/fade.js \
# 	-o vimeowrap.lightsout.js -m

uglifyjs2 src/plugins/playlist/playlist.js \
	src/plugins/playlist/noclickdelay.js \
	-o vimeowrap.playlist.js -m
	