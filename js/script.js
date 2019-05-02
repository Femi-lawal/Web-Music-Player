const play = document.getElementById('play');
let song = document.getElementById('song');
const music = document.getElementById('music');
let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_w, bar_h;

let audio = new Audio();
audio.crossOrigin = "anonymous";
audio.controls = true;
audio.autoplay = false;
audio.loop = true;

window.addEventListener("load", () => {

	music.appendChild(audio);
	
	song.addEventListener('change', (e) => {
		let reader = new FileReader();
		
		if(song.files && song.files[0]) {
			let reader = new FileReader();
			reader.addEventListener('load', (e) => {
				audio.setAttribute('src', e.target.result);
			});

			reader.readAsDataURL(song.files[0]);
		}
	});

    play.addEventListener('click', () => {
        if(song.files[0] != undefined) {
			audio.play();
		}
    });

	context = new AudioContext();
	analyser = context.createAnalyser();
	canvas = document.getElementById('analyser_render');
	ctx = canvas.getContext('2d');
	source = context.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(context.destination);
	draw();

}, false);

function draw() {
	requestAnimationFrame(draw);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	fbc_array = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(fbc_array);
	// analyser.smoothingTimeConstant = .9;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = '#5BC0EB';
	bar_w = 10;
	bars = canvas.width / bar_w;
	for (let i = 0; i < bars; i++) {
		bar_x = i * 12;
		bar_h = Math.min(-(fbc_array[i] * 2), canvas.height);
		ctx.fillRect(bar_x, canvas.height, bar_w, bar_h);
	}
}