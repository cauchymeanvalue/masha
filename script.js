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

function destroyImage() {
  destructionLevel++;
  console.log('click No', destructionLevel);
  
  const factor = 4 + destructionLevel * 6;  
  const temp = document.createElement('canvas');
  const tctx = temp.getContext('2d');
  
  temp.width = Math.floor(canvas.width / factor);
  temp.height = Math.floor(canvas.height / factor);
  
  tctx.drawImage(img, 0, 0, temp.width, temp.height);
  
  ctx.imageSmoothingEnabled = false;
  
  ctx.drawImage(temp, 0, 0, canvas.width, canvas.height);
}

function showNextText() {
  if (destructionLevel > messages.length) return;
  
  const p = document.createElement('p');
  p.textContent = messages[destructionLevel - 1];
  textsContainer.appendChild(p);
  
  setTimeout(() => {
    p.style.opacity = '1';
  }, 100);
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
