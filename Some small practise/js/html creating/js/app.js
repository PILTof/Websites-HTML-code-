const posts = document.getElementById('posts')
const solopost = document.querySelectorAll('.post-solo')
const create_post_btn = document.getElementById('create-post-btn')
const close = document.querySelectorAll('.close')


console.log(posts)

var post_index = 0;

function createPost(img_scr, title_text = 'shit', p_text = 'p - shit') {
	posts.insertAdjacentHTML("beforeend", `<div id="post${post_index}" class="post-solo" >
	${title_text}
	<picture>
		<img src="${img_scr}" width="300px" alt="">
	</picture>
	<p>${p_text}</p>
	</div>`)
}

create_post_btn.addEventListener('click', () => {
	var image_url = document.getElementById('image-url').value
	var title_text = document.getElementById('title-text').value
	var p_text = document.getElementById('p-text').value

	createPost(image_url, title_text, p_text)
	post_index++
})




// https://luxe-host.ru/wp-content/uploads/f/2/b/f2bd2985fb8610be5abdde7cb03ffb2c.jpeg
//

// https://russia-dropshipping.ru/800/600/https/otvet.imgsmail.ru/download/3433f1b9b0c70a9c083bd8b9c88d49ad_i-729.jpg

