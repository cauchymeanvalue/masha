const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textsContainer = document.getElementById('texts');
const finalModal = document.getElementById('final-modal');

let img = new Image();
let destructionLevel = 0;
const MAX_DESTRUCTION = 8; 

const messages = [
  "I will drink a beer",
  "Another beer..",
  "Do you want a joke about a mathematician and a beer?",
  "...so you get it 1+1/2+1/4+1/8....",
  "hhhhh i love you",
  "...ok ACTUALLY l'amour est un oiseau rebelle... do you know how they called sex in 1800s?!",
  "щас",
  "....я не сплю"
];

//pic load

img.src = './assets/image.jpg';

img.onload = () => {
  console.log('image loaded', img.width, 'x', img.height);
  
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
};

img.onerror = () => {
  console.error('no image check something');
  alert('NO');
}

//main

// "function destroyImage() {
//  destructionLevel++;
//  console.log('click No', destructionLevel);
//  
//  const factor = 4 + destructionLevel * 6;  
//  const temp = document.createElement('canvas');
//  const tctx = temp.getContext('2d');
//  
//  temp.width = Math.floor(canvas.width / factor);
//  temp.height = Math.floor(canvas.height / factor);
//  
//  tctx.drawImage(img, 0, 0, temp.width, temp.height);
//  
//  ctx.imageSmoothingEnabled = false;
//  
// ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
//}

function destroyImage() {
  destructionLevel++;
  console.log('click No', destructionLevel);

  const effects = [pixelate, glitch, rgbShift, noiseOverlay, sliceShift, blurPixel, invertBlocks, scanlines];
  const effect = effects[Math.floor(Math.random() * effects.length)];
  effect();
}

function pixelate() {
  const factor = 4 + destructionLevel * 6;
  const temp = document.createElement('canvas');
  const tctx = temp.getContext('2d');
  temp.width = Math.floor(canvas.width / factor);
  temp.height = Math.floor(canvas.height / factor);
  tctx.drawImage(img, 0, 0, temp.width, temp.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
}

function glitch() {
  ctx.drawImage(img, 0, 0);
  const numSlices = 10 + destructionLevel * 5;
  for (let i = 0; i < numSlices; i++) {
    const y = Math.random() * canvas.height;
    const h = Math.random() * 30 + 5;
    const shift = (Math.random() - 0.5) * destructionLevel * 40;
    ctx.drawImage(canvas, 0, y, canvas.width, h, shift, y, canvas.width, h);
  }
}

function rgbShift() {
  ctx.drawImage(img, 0, 0);
  const shift = destructionLevel * 8;
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.5;
  ctx.drawImage(img, shift, 0);
  ctx.drawImage(img, -shift, shift);
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
}

function noiseOverlay() {
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const intensity = destructionLevel * 20;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * intensity;
    data[i] += noise;
    data[i+1] += noise;
    data[i+2] += noise;
  }
  ctx.putImageData(imageData, 0, 0);
}

function sliceShift() {
  ctx.drawImage(img, 0, 0);
  const slices = 5 + destructionLevel * 3;
  const sliceH = canvas.height / slices;
  for (let i = 0; i < slices; i++) {
    if (Math.random() > 0.5) {
      const y = i * sliceH;
      const shift = (Math.random() - 0.5) * destructionLevel * 60;
      ctx.drawImage(canvas, 0, y, canvas.width, sliceH, shift, y, canvas.width, sliceH);
    }
  }
}

function blurPixel() {
  // pixelate then redraw with blur via CSS filter temporarily
  const factor = 2 + destructionLevel * 3;
  const temp = document.createElement('canvas');
  const tctx = temp.getContext('2d');
  temp.width = Math.floor(canvas.width / factor);
  temp.height = Math.floor(canvas.height / factor);
  tctx.drawImage(img, 0, 0, temp.width, temp.height);
  ctx.filter = `blur(${destructionLevel * 2}px)`;
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';
}

function invertBlocks() {
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const blockSize = 20;
  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      if (Math.random() > 0.7) {
        for (let dy = 0; dy < blockSize && y+dy < canvas.height; dy++) {
          for (let dx = 0; dx < blockSize && x+dx < canvas.width; dx++) {
            const idx = ((y+dy) * canvas.width + (x+dx)) * 4;
            data[idx] = 255 - data[idx];
            data[idx+1] = 255 - data[idx+1];
            data[idx+2] = 255 - data[idx+2];
          }
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function scanlines() {
  ctx.drawImage(img, 0, 0);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }
  // add some horizontal color shift
  const shift = destructionLevel * 5;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = `rgba(255, 0, 100, 0.15)`;
  ctx.fillRect(shift, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
}

function showNextText() {
  if (destructionLevel > messages.length) return;
  const existing = document.querySelector('.message-card');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.className = 'message-card';
  card.innerHTML = `
    <span class="close-btn">✕</span>
    <p>${messages[destructionLevel - 1]}</p>
  `;

  textsContainer.appendChild(card);

  setTimeout(() => card.style.opacity = '1', 50);

  card.querySelector('.close-btn').addEventListener('click', (e) => {
    e.stopPropagation(); 
    card.style.opacity = '0';
    setTimeout(() => card.remove(), 400);
  });
} 

//buttons clicks etc

canvas.addEventListener('click', (e) => {
  if (e.button !== 0) return;   
  destroyImage();
  showNextText();

  if (destructionLevel >= MAX_DESTRUCTION) {
    setTimeout(() => {
      finalModal.classList.remove('hidden');
    }, 800);
  }
});

//restart button

//document.querySelector('button').addEventListener('click', () => {
//  location.reload();
//});


//zoom

let scale = 1;
let isDragging = false;
let lastX, lastY;

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? 0.9 : 1.1;
  scale = Math.max(0.5, Math.min(scale * delta, 8));
  canvas.style.transform = `scale(${scale})`;
});

canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = (e.clientX - lastX) * 1.2;
  const dy = (e.clientY - lastY) * 1.2;
  canvas.style.transform += ` translate(${dx}px, ${dy}px)`;
  lastX = e.clientX;
  lastY = e.clientY;
});
