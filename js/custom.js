(function () {
	'use strict';

	// Sample each banner itself so the header stays in sync with the artwork.
	var heroBanners = document.getElementById('home-hero-banners');
	if (heroBanners) {
		var currentBanner = heroBanners.querySelector('.carousel-item.active');
		function matchHeader(slide) {
			document.body.style.setProperty('--hero-header-background', slide.dataset.headerColor);
		}
		matchHeader(currentBanner);
		function sceneCopy(slide) {
			var scene = slide.querySelector('.hero-scene').cloneNode(true);
			scene.setAttribute('aria-hidden', 'true');
			scene.querySelectorAll('a').forEach(function (link) { link.setAttribute('tabindex', '-1'); });
			return scene;
		}
		var bannerSlides = Array.from(heroBanners.querySelectorAll('.carousel-item'));
		var bannerAnimating = false;
		function advanceBanner() {
			if (document.hidden || heroBanners.contains(document.activeElement) || bannerAnimating || bannerSlides.length < 2) return;
			var next = bannerSlides[(bannerSlides.indexOf(currentBanner) + 1) % bannerSlides.length];
			var image = next.querySelector('img');
			// Leave the current artwork visible until the next image is ready.
			if (!image.complete || !image.naturalWidth) return;
			var previous = currentBanner;
			currentBanner = next;
			matchHeader(next);
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				previous.classList.remove('active');
				next.classList.add('active');
				return;
			}
			bannerAnimating = true;
			var panels = document.createElement('div');
			var effects = ['cube-wave', 'iris', 'mosaic', 'curtains', 'zoom', 'diagonal'];
			var effect = effects[bannerSlides.indexOf(next) % effects.length];
			panels.className = 'hero-banner-panels';
			panels.dataset.effect = effect;
			panels.setAttribute('aria-hidden', 'true');
			function artworkLayer(className, artwork) {
				var layer = document.createElement('div');
				layer.className = className;
				layer.appendChild(sceneCopy(artwork === image ? next : previous));
				panels.appendChild(layer);
				return layer;
			}
			if (effect === 'cube-wave') {
				for (var i = 0; i < 5; i++) {
					var panel = document.createElement('div');
					panel.className = 'hero-banner-panel';
					panel.style.setProperty('--panel-index', i);
					panel.style.setProperty('--strip-depth', (heroBanners.clientHeight / 10) + 'px');
					var cube = document.createElement('div');
					cube.className = 'hero-banner-cube';
					[previous.querySelector('img'), image].forEach(function (artwork, faceIndex) {
						var face = document.createElement('div');
						face.className = 'hero-banner-face ' + (faceIndex === 0 ? 'hero-banner-face-front' : 'hero-banner-face-next');
						var faceScene = sceneCopy(faceIndex === 0 ? previous : next);
						faceScene.style.height = '500%';
						faceScene.style.top = (-i * 100) + '%';
						face.appendChild(faceScene);
						cube.appendChild(face);
					});
					panel.appendChild(cube);
					panels.appendChild(panel);
				}
			} else if (effect === 'mosaic') {
				for (var tileIndex = 0; tileIndex < 32; tileIndex++) {
					var tile = artworkLayer('hero-mosaic-tile', image);
					var column = tileIndex % 8;
					var row = Math.floor(tileIndex / 8);
					tile.style.left = (column * 12.5) + '%';
					tile.style.top = (row * 25) + '%';
					var tileScene = tile.firstElementChild;
					tileScene.style.width = '800%';
					tileScene.style.height = '400%';
					tileScene.style.left = (-column * 100) + '%';
					tileScene.style.top = (-row * 100) + '%';
					tile.style.animationDelay = ((tileIndex * 13 % 32) * 16) + 'ms';
				}
			} else if (effect === 'curtains') {
				artworkLayer('hero-artwork', image);
				var leftCurtain = artworkLayer('hero-curtain hero-curtain-left', previous.querySelector('img'));
				var rightCurtain = artworkLayer('hero-curtain hero-curtain-right', previous.querySelector('img'));
				leftCurtain.firstElementChild.style.width = '200%';
				rightCurtain.firstElementChild.style.width = '200%';
				rightCurtain.firstElementChild.style.left = '-100%';
			} else {
				artworkLayer('hero-artwork hero-reveal-' + effect, image);
			}
			heroBanners.appendChild(panels);
			window.setTimeout(function () {
				previous.classList.remove('active');
				next.classList.add('active');
				panels.remove();
				bannerAnimating = false;
			}, 1400);
		}
		window.setInterval(advanceBanner, 4000);
	}


	var tinyslider = function () {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();

	// Two extra sets fill the viewport even when the smaller cards finish a loop.
	var featuredTrack = document.querySelector('.featured-products-track');
	if (featuredTrack) {
		var featuredProducts = Array.from(featuredTrack.children);
		for (var set = 0; set < 2; set++) {
			featuredProducts.forEach(function (product) {
				var copy = product.cloneNode(true);
				copy.setAttribute('aria-hidden', 'true');
				copy.querySelectorAll('a').forEach(function (link) {
					link.setAttribute('tabindex', '-1');
				});
				featuredTrack.appendChild(copy);
			});
		}
		featuredTrack.classList.add('is-ready');
	}





	var sitePlusMinus = function () {

		var value,
			quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
			var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
			var increase = quantityContainer.getElementsByClassName('increase')[0];
			var decrease = quantityContainer.getElementsByClassName('decrease')[0];
			increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
			decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
		}

		function init() {
			for (var i = 0; i < quantity.length; i++) {
				createBindings(quantity[i]);
			}
		};

		function increaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			console.log(quantityAmount, quantityAmount.value);

			value = isNaN(value) ? 0 : value;
			value++;
			quantityAmount.value = value;
		}

		function decreaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			value = isNaN(value) ? 0 : value;
			if (value > 0) value--;

			quantityAmount.value = value;
		}

		init();

	};
	sitePlusMinus();


})()