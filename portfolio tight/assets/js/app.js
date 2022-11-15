const nav_item = document.querySelectorAll('.nav-item > a');
const text_dotts = document.querySelectorAll('.text-dotts');
const img_svg = document.querySelectorAll('.img-svg');
const cont_item = document.querySelectorAll('.cont-item');
const card_img = document.querySelectorAll('.card-img');
const card_popup = document.querySelector('.card-popup');
const close = document.querySelector('.close');
const shady_on_click = document.querySelector('.shady-on-click')



for (let i = 0; i < nav_item.length; ++i) {
	let item = nav_item[i];
	let iteml = text_dotts[i];
	item.addEventListener('mouseover', () => {
		iteml.classList.add('vision')
		console.log('vision add')
	})
	item.addEventListener('mouseout', () => {
		iteml.classList.remove('vision')
	})
}

console.log(nav_item)

for (let i = 0; i < cont_item.length; ++i) {
	let item  = cont_item[i];
	let itemi = img_svg[i];
	item.addEventListener('mouseover', () => {
		itemi.classList.add('img-svg-act')
	})
	item.addEventListener('mouseout', () => {
		itemi.classList.remove('img-svg-act');
	})
}

for (let i = 0; i < card_img.length; ++i) {
	let item = card_img[i];
	item.addEventListener('click', () => {
		card_popup.classList.add('popup-vision');
		shady_on_click.classList.remove('hidden');
	})
}


// popup
close.addEventListener('click', () => {
	card_popup.classList.remove('popup-vision');
	shady_on_click.classList.add('hidden');

})

// SVG CONVERTO

$("img.img-svg").each(function () {
	var $img = $(this);
	var imgClass = $img.attr("class");
	var imgURL = $img.attr("src");
	$.get(imgURL, function (data) {
			var $svg = $(data).find("svg");
			if (typeof imgClass !== "undefined") {
					$svg = $svg.attr("class", imgClass + " replaced-svg");
			}
			$svg = $svg.removeAttr("xmlns:a");
			if (!$svg.attr("viewBox") && $svg.attr("height") && $svg.attr("width")) {
					$svg.attr("viewBox", "0 0 " + $svg.attr("height") + "" + $svg.attr("width"))
			}
			$img.replaceWith($svg);
	}, "xml");
});

// MENU SIZING
var windowInnerWidth = window.innerWidth;
var windowInnerHeight = window.innerHeight;
var menu_width = windowInnerWidth - 280;
const js_helper_size = document.querySelector('body');


document.documentElement.style.setProperty('--menu_width', menu_width + 'px')

document.documentElement.style.setProperty('--menu_height', windowInnerHeight + 'px')

document.documentElement.style.setProperty('--menu_header_bg_w', windowInnerWidth + 'px')


window.addEventListener(`resize`, event => {
	windowInnerWidth = window.innerWidth;
	windowInnerHeight = window.innerHeight;
	menu_width = windowInnerWidth - 280;
	
  document.documentElement.style.setProperty('--menu_width', menu_width + 'px')

	document.documentElement.style.setProperty('--menu_height', windowInnerHeight + 'px')

	document.documentElement.style.setProperty('--menu_header_bg_w', windowInnerWidth + 'px')
});

// NAV M SOCIAL BTNS

const linkedin_btn = document.querySelector('.linkedin img');
const wassap_btn = document.querySelector('.wassap img');

wassap_btn.addEventListener('mouseover', () => {
	wassap_btn.src = "assets/img/wassap64act.svg"
})


wassap_btn.addEventListener('mouseout', () => {
	wassap_btn.src = "assets/img/wassap64.svg"
})



linkedin_btn.addEventListener('mouseover', () => {
	linkedin_btn.src = "assets/img/linkedin64act.svg"
})


linkedin_btn.addEventListener('mouseout', () => {
	linkedin_btn.src = "assets/img/linkedin64.svg"
})


// MENU M  OPEN\CLOSE
const menu_open_btn = document.querySelector('.menu-btn');
const menu_m = document.querySelector('.menu-m');
const menu_close_btn = document.querySelector('.menu-header > img');

menu_open_btn.addEventListener('click', () => {
	menu_m.classList.remove('hidden');
})

menu_close_btn.addEventListener('click', () => {
	menu_m.classList.add('hidden');
})





