const particleGenerateIntervalRate = 3000;
const particleWaveRepetition = 7;
const particleVerticalOffset = 200;

var backgroundImage = new Image();
backgroundImage.src = 'https://s3-eu-west-1.amazonaws.com/imagebucketnikos/almondPetals720p.jpg';
var particleImageDark = new Image();
particleImageDark.src = 'https://s3-eu-west-1.amazonaws.com/imagebucketnikos/almondPetalsParticle720p.png';
var particleImageLight = new Image();
particleImageLight.src = 'https://s3-eu-west-1.amazonaws.com/imagebucketnikos/almondPetalsLight720p.png';
var particleImageLightBig = new Image();
particleImageLightBig.src = 'https://s3-eu-west-1.amazonaws.com/imagebucketnikos/almondPetalsLightBig720p.png';


var canvas;
var context;
var particles = [];
var maxParticleY = backgroundImage.height - particleImageDark.height-300;
var maxParticleX = backgroundImage.width - particleImageDark.width;

class Particle {
  constructor(image, move, initialX,initialY, initialRot) {
      this.x = initialX;
      this.y = initialY;
      this.lifeSpan = 30;
      this.scale = Math.max(Math.random(),.8);
      this.rotation = initialRot;
      this.image = image;
      this.move = move.bind(this);
      this.tick = function(){
        this.lifeSpan--;
      };
  }
}


function init(c) {
    canvas = document.getElementById(c);
    context = canvas.getContext("2d");
    var countParticleGen = 0;
    var particleGeneratorInterval = setInterval(function(){
      countParticleGen = 0;
      makeParticles();
    }, particleGenerateIntervalRate);
    function makeParticles(){
      if(countParticleGen>=particleWaveRepetition){
        return;
      }
      makeParticleTypeDark();
      setTimeout(makeParticleTypeLightBig, 320*Math.random());
      setTimeout(makeParticleTypeLight, 350* Math.random());
      setTimeout(makeParticles, 300);
      countParticleGen++;
    }

    var interval = setInterval(aniloop, 50);
}
function makeParticleTypeLightBig(){
  particles.push(new Particle(
    particleImageLightBig, moveWindBlow,
    backgroundImage.width/2*Math.random(),
    Math.random()*backgroundImage.height/5+particleVerticalOffset,0)
  );
}
function makeParticleTypeLight(){
  particles.push(new Particle(
    particleImageLight, moveWindBlow,
    backgroundImage.width/2*Math.random(),
    Math.random()*backgroundImage.height/5+particleVerticalOffset,0)
  );
}
function makeParticleTypeDark(){
  particles.push(new Particle(
    particleImageDark, moveWindBlow,
    backgroundImage.width*(1-(0.5*Math.random())),
    Math.random()*backgroundImage.height/5+particleVerticalOffset,0)
  );
}
function moveDownwards(){
  this.y = (this.y + Math.random()*20+10)%maxParticleY;
  this.x = this.x + (Math.random()-0.5)*6;
}
function moveUpwards(){
  let rand1 = Math.random();
  let rand2 = Math.random();
  const newY =this.y - (rand1*20+6);
  this.y = newY>0?newY:maxParticleY;
  this.x = (this.x + (rand2-.2)*6+6)%maxParticleX;
  this.rotation = this.rotation +(Math.random()/2-.5);
}
//TODO
function moveWindBlow(){
  let rand1 = Math.random();
  let rand2 = Math.random();
  const newY =this.y - (rand1*5-4*rand2);
  this.y = newY;
  this.x = (this.x + (rand2*20+this.lifeSpan));
  this.rotation = this.rotation +(Math.random()/2-.5);
}
function aniloop() {
    drawWave();
}
function moveParticles(callback){
  particles.map((particle) => {
    particle.move();
  });
  callback();
}
function particlesTick(){
  particles = particles.filter((particle) =>{
    return particle.x<(backgroundImage.width-particleImageLight.width);
  });
  particles.map((particle) =>{
    particle.tick();
  });
}
function drawParticles(callback){
  particles.map((particle) => {
    // context.save();
    // context.translate(backgroundImage.width/2, backgroundImage.height/2); // set canvas context to center
    // context.rotate(particle.rotation);
    context.drawImage(particle.image, particle.x, particle.y, particle.image.width*particle.scale,particle.image.height*particle.scale);
    // context.restore();
  });
  callback();
}

function drawWave() {
    context.drawImage(backgroundImage, 0, 0);
    coordinateParticles();
}

function coordinateParticles(){
  drawParticles(function(){
    moveParticles(particlesTick);
  });
}

window.onload = function() {
  init("canvas");
};
