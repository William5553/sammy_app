// get rid of the internet explorer nerds
if (window.navigator.userAgent.indexOf('MSIE') > 0 || /Trident.*rv:11\./.test(navigator.userAgent))
  window.location.replace('https://www.google.com/chrome/');

const createMusa = () => {
  const img = document.createElement('img');
  
  img.src = 'assets/musa.png';
  img.style.position = 'absolute';
  img.style.left = Math.max(Math.floor(Math.random() * window.innerWidth - 290), 0) + 'px';
  img.style.top = '-10px';

  document.body.append(img);

  const move = () => {
    img.style.top = `${Number.parseInt(img.style.top) + 10}px`;

    if (Number.parseInt(img.style.top) > window.innerHeight + 300)
      img.remove();
      
    requestAnimationFrame(move);
  };

  move();
};

document.querySelector('#easter-egg').addEventListener('click', () => {
  const loop = setInterval(createMusa, 100);
  setTimeout(() => clearInterval(loop), 10000);
});