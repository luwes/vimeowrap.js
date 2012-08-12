(function(global) {

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

			this.theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
			if (this.theTarget.nodeType == 3) this.theTarget = theTarget.parentNode;
			this.theTarget.className += " pressed";

			this.element.addEventListener('touchmove', this, false);
			this.element.addEventListener('touchend', this, false);
		},

		touchmove: function(e) {
			this.moved = true;
			this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
		},

		touchend: function(e) {
			e.preventDefault();
			
			this.element.removeEventListener('touchmove', this, false);
			this.element.removeEventListener('touchend', this, false);

			if (!this.moved && this.theTarget) {
				this.theTarget.className = this.theTarget.className.replace(/ ?pressed/gi, '');
				var theEvent = document.createEvent('MouseEvents');
				theEvent.initEvent('click', true, true);
				this.theTarget.dispatchEvent(theEvent);
			}

			this.theTarget = undefined;
		},

		click: function(e) {
			if (this.theTarget === undefined) {
				e.stopImmediatePropagation();
				e.preventDefault();
			}
		}
	};

	global['NoClickDelay'] = NoClickDelay;

})(vimeowrap.carousel);
