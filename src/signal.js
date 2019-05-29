
var signal = function() {
	var _callbacks = [];

	this.add = function(func) {
		_callbacks.push(func);
	};

	this.dispatch = function() {
		var args = Array.prototype.slice.call(arguments);
		for (var i=0; i<_callbacks.length; i++) {
			if (typeof _callbacks[i] === "function") {
				_callbacks[i].apply(this, args);
			}
		}
	};

	this.remove = function(func) {
		if (func) {
			for (var i=0; i<_callbacks.length; i++) {
				if (_callbacks[i] === func) {
					_callbacks.splice(i, 1);
					i--;
				}
			}
		} else {
			_callbacks = [];
		}
	};
};
