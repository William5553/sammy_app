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

const changeSammy = (bodyParts = [ 'head', 'body', 'legs' ]) => {
    customHead = false;
    bodyParts.forEach(part => {
        const element = document.getElementById(`sammy-${part}`);
        element.src = `assets/sammies/${sammies[currentSammy[part]]}/${part}.png`;
    });
};

[ 'head', 'body', 'legs' ].forEach(part => {
    [ 'prev', 'forw' ].forEach(direction => {
        const arrow = document.getElementById(`arrow-${direction}-${part}`);

        arrow.addEventListener('click', () => {
            if (direction == 'prev')
                currentSammy[part]--;
            else if (direction == 'forw')
                currentSammy[part]++;

            if (currentSammy[part] < 0)
                currentSammy[part] = sammies.length - 1;
            if (currentSammy[part] >= sammies.length)
                currentSammy[part] = 0;
            changeSammy([ `${part}` ]);
        });
    });
});

const headInput = document.getElementById('input-head');

headInput.addEventListener('input', () => {
    if (!headInput.value || headInput.value == '') {
        customHead = false
        return changeSammy([ 'head' ]);
    }

    const element = document.getElementById('sammy-head');
    element.src = window.URL.createObjectURL(headInput.files[0]);
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

// TODO: make randomize not randomize if custom head