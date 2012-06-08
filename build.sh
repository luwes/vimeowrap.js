#!/bin/bash

java -jar compiler/compiler.jar \
	--js=src/vimeowrap.js \
	--js=src/playlistloader.js \
	--js=src/utils.js \
	--js=src/signal.js \
	--js=src/froogaloop.js \
	--js_output_file=vimeowrap.js \
	--output_wrapper "if (typeof vimeowrap === 'undefined') {%output%}" \
	#--compilation_level ADVANCED_OPTIMIZATIONS \
	
# java -jar compiler/compiler.jar \
# 	--js=src/plugins/carousel/carousel.js \
# 	--js=src/plugins/carousel/noclickdelay.js \
# 	--js=src/plugins/carousel/Tween.js \
# 	--js_output_file=vimeowrap.carousel.js \
	
java -jar compiler/compiler.jar \
	--js=src/plugins/lightsout/lightsout.js \
	--js=src/plugins/lightsout/fade.js \
	--js_output_file=vimeowrap.lightsout.js \
