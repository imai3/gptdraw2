const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

let touching = false;
let lastX = 0;
let lastY = 0;
let penmode = "move"
let color = [150, 255];
let line = [1, 3]
let num = 0
const ten_haba = 30
let only_color = 999
const range = 20
context.strokeStyle = `rgb(${color[num]},${color[num]},${color[num]})`
context.lineWidth = line[num]


window.addEventListener("keydown", (event) => {

	if (event.key == "Enter") penmode = "draw";
	if (event.key == ".") penmode = "pick";
	if (event.key == "9") color[num] += 10
	if (event.key == "8") color[num] -= 10
	if (color[num] > 255) color[num] = 255
	if (color[num] < 0) color[num] = 0
	if (event.key == "6") line[num] += 1
	if (event.key == "5") line[num] -= 1
	if (line[num] > 55) line[num] = 55
	if (line[num] < 0) line[num] = 0
	if (event.key == "0") penmode = "draw_only"

	context.strokeStyle = `rgb(${color[num]},${color[num]},${color[num]})`
	context.lineWidth = line[num]
})

window.addEventListener("keyup", (event) => {
	if (event.key == "Enter") penmode = "move";
	if (event.key == ".") penmode = "move";
	if (event.key == "0") penmode = "move";
	if (event.key == "+") num = (num + 1) % 2;
})

canvas.addEventListener('touchstart', (event) => {
	touching = true;
	const rect = canvas.getBoundingClientRect();
	lastX = event.touches[0].clientX - rect.left;
	lastY = event.touches[0].clientY - rect.top;
	const imageData = context.getImageData(lastX, lastY, 1, 1);
	if (penmode == "pick") color[num] = imageData.data[0];
	if (penmode == "draw_only") only_color = imageData.data[0];
});


function draw_pixel(x, y, color) {
	imageData = context.getImageData(x, y, 1, 1);
	const pixels = imageData.data;
	pixels[0] = color;
	pixels[1] = color;
	pixels[2] = color
	context.putImageData(imageData, x, y);
}

function draw_small_rect(x, y, color) {
	context.beginPath();
	context.rect(x, y, 1, 1)
	context.fillStyle = `rgb(${color},${color},${color})`;
	context.fill();
}

canvas.addEventListener('touchmove', (event) => {
	if (penmode == "move") return
	event.preventDefault();
	const rect = canvas.getBoundingClientRect();
	const x = event.touches[0].clientX - rect.left;
	const y = event.touches[0].clientY - rect.top;
	const dx = (x - lastX) / ten_haba
	const dy = (y - lastY) / ten_haba

	if (touching && penmode == "draw") {
		for (let i = 0; i < ten_haba; i++) {
			console.log(context.getImageData(lastX + dx * i, lastY + dy * i, 1, 1).data[0])
			draw_small_rect(lastX + dx * i, lastY + dy * i, color[num])
		}
	}
	if (touching && penmode == "draw_only") {
		for (let i = 0; i < ten_haba; i++) {
			let this_pixel_color = context.getImageData(lastX + dx * i, lastY + dy * i, 1, 1).data[0]
			if ((only_color-range < this_pixel_color&&this_pixel_color<only_color+range)) draw_small_rect(lastX + dx * i, lastY + dy * i, color[num])
		}
	}
	if (touching && penmode == "pick") {
		const imageData = context.getImageData(x, y, 1, 1);
		color[num] = imageData.data[0]
	}


	lastX = x;
	lastY = y;

});



canvas.addEventListener('touchend', () => {
	touching = false;
});
