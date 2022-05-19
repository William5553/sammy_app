const sammies = [
    'default',
    'drippy',
    'construction',
    'sales-associate',
    'nurse',
    'scientist',
    'minecraft'
];

const currentSammy = {
    head: 0,
    body: 0,
    legs: 0
};

const changeSammy = (bodyParts = [ 'head', 'body', 'legs' ]) => {
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
    if (!headInput.value || headInput.value == '')
        return changeSammy([ 'head' ]);

    const element = document.getElementById('sammy-head');
    element.src = window.URL.createObjectURL(headInput.files[0]);
});