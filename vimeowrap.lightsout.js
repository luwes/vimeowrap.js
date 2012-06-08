/*

 Vimeo Wrap - Lights Out plugin

 Author: Wesley Luyten
 Version: 1.0 - (2012/06/08)
*/
(function(g){g.lightsout=function(i,b){function j(){i.pause();e.on()}function h(){if("off"==b.onplay)e.off();else e.on()}function c(){if("off"==b.onpause)e.off();else e.on()}function f(){if("off"==b.onfinish)e.off();else e.on()}var a,e;this.config=b=g.utils.extend({backgroundcolor:"000000",opacity:0.8,time:800,onplay:"off",onpause:"on",onfinish:"on",parentid:null},b);this.setup=function(){a=document.createElement("div");a.className+=" lightsout_shade";a.style.display="none";a.style.backgroundColor=
"#"+b.backgroundcolor;a.style.zIndex=300;a.style.opacity=0;a.style.filter="alpha(opacity=0)";a.style.top=0;a.style.left=0;a.style.bottom=0;a.style.right=0;b.parentid?(a.style.position="absolute",document.getElementById(b.parentid).style.position="relative",document.getElementById(b.parentid).appendChild(a)):(a.style.position="fixed",document.body.appendChild(a));a.onclick=j;e=new g.lightsout.Fade(a,b.time,b.opacity);i.display.style.zIndex=301;i.events.froogaloopReady.add(function(a){a.addEvent("play",
h);a.addEvent("pause",c);a.addEvent("finish",f)})}}})(vimeowrap);(function(g){g.Fade=function(g,b,j){function h(a){c.element.style.opacity=""+a;c.element.style.filter="alpha(opacity="+Math.round(100*a)+")";c.opacity=a}this.element=g;this.time=b||1E3;this.dark=j||0.8;this.opacity=0;var c=this,f;"opacity"in c.element.style||(c.element.style.zoom=1);this.off=function(){c.element.style.display="block";clearInterval(f);var a=(new Date).getTime(),b=c.opacity;f=setInterval(function(){var d=((new Date).getTime()-a)/c.time;if(d>=1){d=1;clearInterval(f)}h(c.dark*d+b*(1-
d))},1E3/60)};this.on=function(){clearInterval(f);var a=(new Date).getTime(),b=c.opacity;f=setInterval(function(){var d=((new Date).getTime()-a)/c.time;if(d>=1){d=1;clearInterval(f);c.element.style.display="none"}h(0*d+b*(1-d))},1E3/60)};this.toggle=function(){if(c.opacity<0.5)c.off();else c.on()}}})(vimeowrap.lightsout);
