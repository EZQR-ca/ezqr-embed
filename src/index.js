/*!
 * ezqr-embed - Drop-in embeddable QR code generator widget for any website.
 * Auto-mounts on [data-ezqr-embed] elements; also exposes window.EZQR.render().
 * Free QR code generator powered by https://ezqr.ca
 *
 * @license MIT
 */
(function (root) {
	'use strict';

	var DEFAULT_HEIGHT = 520;
	var ATTR_MOUNTED = 'data-ezqr-mounted';

	function buildIframe(opts) {
		var height = opts.height > 0 ? opts.height : DEFAULT_HEIGHT;
		var iframe = document.createElement('iframe');
		iframe.src = 'https://ezqr.ca/embed';
		iframe.title = 'EZQR - Free QR Code Generator';
		iframe.loading = 'lazy';
		iframe.setAttribute('frameborder', '0');
		iframe.setAttribute('scrolling', 'no');
		iframe.style.cssText = 'width:100%;border:0;display:block;height:' + height + 'px;max-width:100%;';
		return iframe;
	}

	function ensureAttribution(container, opts) {
		if (opts.attribution === false) return;
		var scope = container.parentElement || document.body;
		if (scope.querySelector('a[href*="ezqr.ca"]')) return;
		var p = document.createElement('p');
		p.style.cssText = 'font-size:12px;text-align:center;margin:8px 0;color:#5d6d7e;font-family:sans-serif;';
		var a = document.createElement('a');
		a.href = 'https://ezqr.ca/?utm_source=embed-attrib';
		a.target = '_blank';
		a.rel = 'noopener';
		a.style.cssText = 'color:#1a6b3b;text-decoration:none;';
		a.textContent = 'Free QR code generator';
		p.appendChild(a);
		p.appendChild(document.createTextNode(' by EZQR'));
		container.parentNode.insertBefore(p, container.nextSibling);
	}

	function render(target, options) {
		var opts = options || {};
		var container = typeof target === 'string' ? document.querySelector(target) : target;
		if (!container) return null;
		if (container.getAttribute(ATTR_MOUNTED) === '1') return container;

		var heightAttr = parseInt(container.getAttribute('data-ezqr-height'), 10);
		if (!opts.height && heightAttr > 0) opts.height = heightAttr;

		container.setAttribute(ATTR_MOUNTED, '1');
		container.innerHTML = '';
		container.appendChild(buildIframe(opts));
		ensureAttribution(container, opts);
		return container;
	}

	function renderAll(options) {
		var nodes = document.querySelectorAll('[data-ezqr-embed]');
		var out = [];
		for (var i = 0; i < nodes.length; i++) out.push(render(nodes[i], options));
		return out;
	}

	var api = { render: render, renderAll: renderAll };

	if (typeof module !== 'undefined' && module.exports) module.exports = api;
	if (root) root.EZQR = api;

	function autoInit() {
		if (typeof document === 'undefined') return;
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', function () { renderAll(); });
		} else {
			renderAll();
		}
	}

	autoInit();
})(typeof window !== 'undefined' ? window : null);
