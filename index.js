const sammies = [
    'default',
    'drippy',
    'construction',
    'sales-associate',
    'nurse',
    'scientist',
    'minecraft',
    'cowboy'
];

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

const ensurePageExists = async part => {
    let pageExists = await checkIfPageExists(getPartURL(part));
    while (!pageExists) {
        if (currentSammy[part] + 1 === currentSammy[part])
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

const changeSammy = (bodyParts = [ 'head', 'body', 'legs' ]) => {
    bodyParts.forEach(async part => {
        const element = document.getElementById(`sammy-${part}`);
        await ensurePageExists(part);

        element.src = getPartURL(part);

        if (part == 'head')
            customHead = false;
    });
};

[ 'head', 'body', 'legs' ].forEach(part => {
    [ 'prev', 'forw' ].forEach(direction => {
        const arrow = document.getElementById(`arrow-${direction}-${part}-inner`);

        arrow.onclick = () => {
            if (direction == 'prev')
                currentSammy[part]--;
            else if (direction == 'forw')
                currentSammy[part]++;

            if (currentSammy[part] < 0)
                currentSammy[part] = sammies.length - 1;
            if (currentSammy[part] >= sammies.length)
                currentSammy[part] = 0;

            changeSammy([ `${part}` ]);
        };
    });
});

const headInput = document.getElementById('input-head');

headInput.addEventListener('input', () => {
    if (!headInput.value || headInput.value == '') {
        customHead = false
        return changeSammy([ 'head' ]);
    }

    const element = document.getElementById('sammy-head');
    element.src = URL.createObjectURL(headInput.files[0]);
    customHead = true;
});

const randomizeButton = document.getElementById('randomize');

randomizeButton.addEventListener('click', () => {
    if (!customHead) {
        currentSammy.head = Math.floor(Math.random() * sammies.length);
        changeSammy([ 'head' ]);
    }

    currentSammy.body = Math.floor(Math.random() * sammies.length);
    currentSammy.legs = Math.floor(Math.random() * sammies.length);
    
    changeSammy([ 'body', 'legs' ]);
});

const colourSchemeButton = document.getElementById('colour-toggle-inner');

colourSchemeButton.onclick = () => {
    document.body.classList.toggle('light-mode');
    colourSchemeButton.src = `assets/${document.body.classList.contains('light-mode') ? 'moon' : 'sun'}.png`;
};
