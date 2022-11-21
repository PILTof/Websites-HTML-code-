let play_btn = document.querySelector('.play');
let close_btn = document.querySelector('.close');
let next_btn = document.querySelector('.next');
let audio = document.querySelector('.audio');
let player = document.querySelector('.s-post-player');
let player_wrapp = document.querySelector('.s-post-play')
const player_dott = document.querySelector('.player-dott');
const player_line = document.querySelector('.player-line');
const play_img = document.querySelectorAll('.play-img');
const inplay_img = document.querySelectorAll('.inplay-img');

// console.log('bg');

console.log(play_btn);


		
		// songs
		const songs = ['9 (пермастер)', 'hub711'];
		
		let songIndex = 0;


		
		
		for (let i = 0; i < play_img.length; ++i) {
			let iteml = play_img[i];
			let itemi = inplay_img[i];
			iteml.addEventListener('click', () => {
				songIndex = i;
				player_wrapp.classList.remove('hidden');
				iteml.classList.toggle('circle-down')
				audio.classList.toggle('playing');
				itemi.classList.toggle('playing');
				audio.src = 'assets/audio/' + songs[songIndex] + '.mp3'
				console.log(audio.src)
				const isPlaying = audio.classList.contains('playing');
				playSong();
				
			})
		}
		
		
		var postIndex = 0;

		



player.addEventListener('click', ()=> {
	audio.classList.toggle('playing');
})

close_btn.addEventListener('click', () => {
	player_wrapp.classList.add('hidden');
})




function playSong() {
	audio.play();
}

function pauseSong() {
	audio.pause();
}

play_btn.addEventListener('click', () => {
	const isPlaying = audio.classList.contains('playing')
	if(isPlaying) {
		playSong();
	} else {
		pauseSong();
	}
})


// progress bar

function updateProgress(e) {
	const {duration, currentTime} = e.srcElement
	const progressPercent = ( currentTime / duration ) * 100
	let percent = progressPercent + '%'
	// console.log(percent)
	player_dott.style.marginLeft = percent
}

audio.addEventListener('timeupdate', updateProgress)

// set progress


function setProgress(e) {
	const width = this.clientWidth
	const clickX = e.offsetX
	const duration = audio.duration

	audio.currentTime = (clickX / width) * duration
}

player_line.addEventListener('click', setProgress) 

