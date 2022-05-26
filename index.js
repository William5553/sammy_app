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
const checkIfPageExists = url => {
    if (pageExistsCache[url] != null)
        return pageExistsCache[url];

    const result = fetch(url, { method: 'HEAD', cache: 'no-cache' })
    .then(response => response.ok)
    .catch(() => false);

    pageExistsCache[url] = result;

    return result;
};

const getPartURL = part => `assets/sammies/${sammies[currentSammy[part]]}/${part}.png`;

const changeSammy = (bodyParts = [ 'head', 'body', 'legs' ]) => {
    bodyParts.forEach(part => {
        const element = document.getElementById(`sammy-${part}`);
        const url = getPartURL(part);

        element.src = url;

        if (part == 'head')
            customHead = false;
    });
};

[ 'head', 'body', 'legs' ].forEach(part => {
    [ 'prev', 'forw' ].forEach(direction => {
        const arrow = document.getElementById(`arrow-${direction}-${part}-inner`);

        arrow.onclick = async () => {
            if (direction == 'prev')
                currentSammy[part]--;
            else if (direction == 'forw')
                currentSammy[part]++;

            if (currentSammy[part] < 0)
                currentSammy[part] = sammies.length - 1;
            if (currentSammy[part] >= sammies.length)
                currentSammy[part] = 0;

            let pageExists = await checkIfPageExists(getPartURL(part));
            while (!pageExists) {
                if (direction == 'prev')
                    currentSammy[part]--;
                else if (direction == 'forw')
                    currentSammy[part]++;

                if (currentSammy[part] < 0)
                    currentSammy[part] = sammies.length - 1;
                if (currentSammy[part] >= sammies.length)
                    currentSammy[part] = 0;

                pageExists = await checkIfPageExists(getPartURL(part));
            }

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

randomizeButton.addEventListener('click', async () => {
    if (!customHead) {
        currentSammy.head = Math.floor(Math.random() * sammies.length);
        changeSammy([ 'head' ]);
    }

    currentSammy.body = Math.floor(Math.random() * sammies.length);
    currentSammy.legs = Math.floor(Math.random() * sammies.length);
    let pageExists = await checkIfPageExists(getPartURL('legs'));
    while (!pageExists) {
        currentSammy.legs++;

        if (currentSammy.legs >= sammies.length)
            currentSammy.legs = 0;

        pageExists = await checkIfPageExists(getPartURL('legs'));
    }

    changeSammy([ 'body', 'legs' ]);
});