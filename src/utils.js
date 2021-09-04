
var utils = {};

utils.jsonp = function(url, params, callback) {
		
	var query = url.indexOf('?') === -1 ? "?" : "&";
	params = params || {};
	for (var key in params) {
		if (params.hasOwnProperty(key)) {
			query += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
		}
	}
	
	var jsonp = utils.uniqueId("json_call");
	window[jsonp] = function(data) {
		callback(data);
		window[jsonp] = null;
	};

	var script = document.createElement('script');
	script.src = url + query + "callback=" + jsonp;
	script.async = true;
	script.onload = script.onreadystatechange = function() {
		if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
			script.onload = script.onreadystatechange = null;
			if (script && script.parentNode) {
				script.parentNode.removeChild(script);
			}
		}
	};
	
	var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
	// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
	// This arises when a base node is used (#2709 and #4378).
	head.insertBefore(script, head.firstChild);
};

utils.extend = function(destination, source) {
	for (var property in source) {
		if (source[property] && source[property].constructor &&
			source[property].constructor === Object) {
			destination[property] = destination[property] || {};
			arguments.callee(destination[property], source[property]);
		} else {
			destination[property] = source[property];
		}
	}
	return destination;
};

utils.css = function(domelement, styles, debug) {
	if (domelement) {
		for (var style in styles) {
			try {
				if (typeof styles[style] === "undefined") {
					continue;
				} else if (typeof styles[style] == "number" && !(style == "zIndex" || style == "opacity")) {
					if (isNaN(styles[style])) {
						continue;
					}
					styles[style] = Math.ceil(styles[style]) + "px";
				}
				domelement.style[style] = styles[style];
			} catch (err) {
			}
		}
	}
};

utils.prepend = function(child, parent) {
	if (parent.firstChild) {
		parent.insertBefore(child, parent.firstChild);
	} else {
		parent.appendChild(child);
	}
};

var idCounter = 0;
utils.uniqueId = function(prefix) {
	var id = idCounter++;
	return prefix ? prefix + id : id;
};


if (!Array.indexOf) {
	Array.prototype.indexOf = function(obj) {
		for (var i=0; i<this.length; i++) {
			if (this[i] == obj) {
				return i;
			}
		}
		return -1;
	};
}

String.prototype.populate = function(obj, funcs) {
	return this.replace(/\{\{\s*([^|\s}]+)\|?([^\s}]*)\s*\}\}/g, function(match, key, mods) {
		var str = obj[key];
		if (typeof str !== "undefined") {
			if (funcs && mods) {
				var arr = mods.split('|');
				for (var i = 0; i < arr.length; i++) {
					var mod = arr[i].split(':')[0];
					var par = arr[i].split(':')[1];
					var args = par ? par.split(',') : [];
					args.unshift(str);
					if (typeof funcs[mod] === "function") {
						str = funcs[mod].apply(str, args);
					}
				}
			}
			return str;
		} else {
			return match;
		}
	});
};
