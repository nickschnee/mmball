var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var numStars = 300;
var stars = [];
var size = 1;
var fl = canvas.width;
var centerX = canvas.width/2;
var centerY = canvas.height/2;
var speed = 3;
for (var i = 0; i < numStars; i++) {
    stars[i] = new Star();
}
function Star() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * canvas.width;
this.move = function(){
    this.z = this.z-speed;
    if(this.z<=0){
        this.z=canvas.width;
    }
}
    
this.show = function () {
        var x,y,s;
    x = (this.x - centerX) * (fl/this.z);
    x = x + centerX;
    y = (this.y - centerY) * (fl/this.z);
    y=y+centerY;
    s= size *(fl/this.z);
        c.beginPath();
        c.fillStyle = "white";
        c.arc(x, y, s, 0, Math.PI * 2);
        c.fill();
    }
}
function draw() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < numStars; i++) {
        stars[i].show();
        stars[i].move();
    }
}
function update() {
    draw();
    window.requestAnimationFrame(update);
}

/* for (var x = 0; x<canvas.width; x++){
    for(var y = 0; y<canvas.height; y++){
        c.fillStyle = 'hsl(0, 0%, ' + ( 100 - ( Math.random() * 15 ) ) + '%)';
        c.fillRect(x, y, 1, 1);
    }
} */

update();
/* document.body.style.background = 'url(' + c.toDataURL() + ')'; */