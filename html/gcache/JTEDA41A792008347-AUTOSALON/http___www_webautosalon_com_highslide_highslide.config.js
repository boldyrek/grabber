/**
*	Site-specific configuration settings for Highslide JS
*/
hs.graphicsDir = 'highslide/graphics/';
hs.outlineType = 'custom';
hs.dimmingOpacity = 0.75;
hs.fadeInOut = true;
hs.align = 'center';
hs.allowSizeReduction = true;
hs.marginTop = 68;
hs.marginRight = 7;
hs.marginBottom = 110;
hs.captionEval = 'this.a.title';


// Add the slideshow controller
hs.addSlideshow({
	slideshowGroup: 'group1',
	interval: 5000,
	repeat: true,
	useControls: true,
	fixedControls: 'fit',
	overlayOptions: {
		className: 'text-controls',
		opacity: 0.55,
		position: 'bottom center',
		offsetX: 0,
		offsetY: -40,
		relativeTo: 'viewport',
		hideOnMouseOut: false
	},
	thumbstrip: {
		mode: 'horizontal',
		position: 'top center',
		relativeTo: 'viewport'
	}

});

// Russian language strings
hs.lang = {
	cssDirection: 'ltr',
	loadingText: 'Загружается...',
	loadingTitle: 'Нажмите для отмены',
	focusTitle: 'Нажмите чтобы поместить на передний план',
	fullExpandTitle: 'Развернуть до оригинального размера',
	creditsText: '<i>Auto Trader</i>',
	creditsTitle: 'Перейти на домашнюю страницу Auto Treder',
	previousText: 'Предыдущее',
	nextText: 'Следующее',
	moveText: 'Переместить',
	closeText: 'Закрыть',
	closeTitle: 'Закрыть (esc)',
	resizeTitle: 'Изменить размер',
	playText: 'Слайдшоу',
	playTitle: 'Начать слайдшоу (пробел)',
	pauseText: 'Пауза',
	pauseTitle: 'Приостановить слайдшоу (пробел)',
	previousTitle: 'Предыдущее (стрелка влево)',
	nextTitle: 'Следующее (стрелка вправо)',
	moveTitle: 'Переместить',
	fullExpandText: 'Оригинальный размер',
	number: 'Изображение %1 из %2',
	restoreTitle: 'Нажмите чтобы закрыть изображение, зажмите и перетащите для изменения местоположения.'
};
// watermark overlay
hs.registerOverlay({
   html: '<div class="watermark"></div>',
   position: 'bottom right',
   fade: 0,
   opacity: 0.5
});
// gallery config object
var config1 = {
	slideshowGroup: 'group1',
	numberPosition: 'caption',
	transitions: ['expand', 'crossfade']
};
