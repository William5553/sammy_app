import sammies from '../assets/dressmy/sammies.json' assert { type: "json" };

const currentSammy = {
  head: 0,
  body: 0,
  legs: 0
};

let customHead = false;

const pageExistsCache = {};
const checkIfPageExists = async url => {
  if (pageExistsCache[url] != null)
    return pageExistsCache[url];

  const result = await fetch(url, { method: 'HEAD', cache: 'no-cache' })
    .then(response => response.ok)
    .catch(() => false);

  pageExistsCache[url] = result;

  return result;
};

const getPartURL = part => `assets/sammies/${sammies[currentSammy[part]]}/${part}.png`;

const ensurePageExists = async (part, direction) => {
  let pageExists = await checkIfPageExists(getPartURL(part));
  while (!pageExists) {
    if (direction == 'prev')
      currentSammy[part]--;
    else
      currentSammy[part]++;

    if (currentSammy[part] < 0)
      currentSammy[part] = sammies.length - 1;
    if (currentSammy[part] >= sammies.length)
      currentSammy[part] = 0;

    pageExists = await checkIfPageExists(getPartURL(part));
  }
};

const changeSammy = (bodyParts = [ 'head', 'body', 'legs' ], direction) => {
  bodyParts.forEach(async part => {
    const element = document.querySelector(`#sammy-${part}`);
    await ensurePageExists(part, direction);

    element.src = getPartURL(part);

    if (part == 'head' && customHead) {
      customHead = false;
      headInput.value == '';
    }
  });
};

[ 'head', 'body', 'legs' ].forEach(part => {
  [ 'prev', 'forw' ].forEach(direction => {
    const arrow = document.querySelector(`#arrow-${direction}-${part}-inner`);

    arrow.onclick = () => {
      if (direction == 'prev')
        currentSammy[part]--;
      else if (direction == 'forw')
        currentSammy[part]++;

      if (currentSammy[part] < 0)
        currentSammy[part] = sammies.length - 1;
      if (currentSammy[part] >= sammies.length)
        currentSammy[part] = 0;

      changeSammy([ `${part}` ], direction);
    }
  });
});

const headInput = document.querySelector('#input-head');
const randomizeButton = document.querySelector('#randomize');
const colourSchemeButton = document.querySelector('#colour-toggle-inner');

headInput.addEventListener('input', () => {
  if (!headInput.value || headInput.value == '') {
    customHead = false;
    return changeSammy([ 'head' ]);
  }

  const element = document.querySelector('#sammy-head');
  element.src = URL.createObjectURL(headInput.files[0]);
  customHead = true;
});

randomizeButton.onclick = () => {
  if (!customHead) {
    currentSammy.head = Math.floor(Math.random() * sammies.length);
    changeSammy([ 'head' ]);
  }

  currentSammy.body = Math.floor(Math.random() * sammies.length);
  currentSammy.legs = Math.floor(Math.random() * sammies.length);
    
  changeSammy([ 'body', 'legs' ]);
}

colourSchemeButton.onclick = () => {
  document.body.classList.toggle('light-mode');
  colourSchemeButton.src = `assets/dressmy/${document.body.classList.contains('light-mode') ? 'moon' : 'sun'}.png`;
}

(function () {
  var src = '//cdn.jsdelivr.net/npm/eruda';
  if (!/eruda=true/.test(window.location) && localStorage.getItem('active-eruda') != 'true') return;
  document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
  document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();