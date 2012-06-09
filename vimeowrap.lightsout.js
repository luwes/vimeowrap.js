/*

 Vimeo Wrap - Lights Out plugin

 Author: Wesley Luyten
 Version: 1.0 - (2012/06/08)
*/
(function(h){h.lightsout=function(e,b){function j(){e.pause();f.on()}function i(){if("off"==b.onplay)f.off();else f.on()}function c(){if("off"==b.onpause)f.off();else f.on()}function g(){if("off"==b.onfinish)f.off();else f.on()}var a,f;this.config=b=h.utils.extend({backgroundcolor:"000000",opacity:0.8,time:800,onplay:"off",onpause:"on",onfinish:"on",parentid:null},b);this.setup=function(){a=document.createElement("div");a.className+=" lightsout_shade";a.style.display="none";a.style.backgroundColor=
"#"+b.backgroundcolor;a.style.zIndex=300;a.style.opacity=0;a.style.filter="alpha(opacity=0)";a.style.top=0;a.style.left=0;a.style.bottom=0;a.style.right=0;b.parentid?(a.style.position="absolute",document.getElementById(b.parentid).style.position="relative",document.getElementById(b.parentid).appendChild(a)):(a.style.position="fixed",document.body.appendChild(a));a.onclick=j;f=new h.lightsout.Fade(a,b.time,b.opacity);e.display.style.zIndex=301;e.events.playerReady.add(function(){e.onPlay(i);e.onPause(c);
e.onFinish(g)})}}})(vimeowrap);(function(h){h.Fade=function(e,b,h){function i(a){c.element.style.opacity=""+a;c.element.style.filter="alpha(opacity="+Math.round(100*a)+")";c.opacity=a}this.element=e;this.time=b||1E3;this.dark=h||0.8;this.opacity=0;var c=this,g;"opacity"in c.element.style||(c.element.style.zoom=1);this.off=function(){c.element.style.display="block";clearInterval(g);var a=(new Date).getTime(),b=c.opacity;g=setInterval(function(){var d=((new Date).getTime()-a)/c.time;if(d>=1){d=1;clearInterval(g)}i(c.dark*d+b*(1-
d))},1E3/60)};this.on=function(){clearInterval(g);var a=(new Date).getTime(),b=c.opacity;g=setInterval(function(){var d=((new Date).getTime()-a)/c.time;if(d>=1){d=1;clearInterval(g);c.element.style.display="none"}i(0*d+b*(1-d))},1E3/60)};this.toggle=function(){if(c.opacity<0.5)c.off();else c.on()}}})(vimeowrap.lightsout);
