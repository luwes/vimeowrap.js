
function NoClickDelay(el) {
	if ('ontouchstart' in window) {
		this.element = typeof el === "object" ? el : document.getElementById(el);
		this.element.addEventListener('touchstart', this, false);
		this.element.addEventListener('click', this, true);
	}
}

NoClickDelay.prototype = {
	handleEvent: function(e) {
		this[e.type](e);
	},

	touchstart: function(e) {
		this.moved = false;

		this.target = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
		if (this.target.nodeType == 3) this.target = target.parentNode;

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);
	},

	touchmove: function(e) {
		this.moved = true;
		this.target.className = this.target.className.replace(/ ?pressed/gi, '');
	},

	touchend: function(e) {
		e.preventDefault();
		
		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);

		if (!this.moved && this.target) {
			this.target.className += " pressed";
			var t = this.target;
			setTimeout(function() {
				t.className = t.className.replace(/ ?pressed/gi, '');
			}, 150);
			
			var theEvent = document.createEvent('MouseEvents');
			theEvent.initEvent('click', true, true);
			this.target.dispatchEvent(theEvent);
		}

		this.target = undefined;
	},

	click: function(e) {
		if (this.target === undefined) {
			e.stopImmediatePropagation();
			e.preventDefault();
		}
	}
};
