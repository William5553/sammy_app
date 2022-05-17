const sammies = [
    'default',
    'drippy',
    'construction'
];

const prev = document.getElementById('arrow-prev');
const forw = document.getElementById('arrow-forw');

const currentSammy = {
    head: 0,
    body: 0,
    legs: 0
};

const changeSammy = () => {
    [ 'head', 'body', 'legs' ].forEach(part => {
        const element = document.getElementById(`sammy-${part}`);
        element.src = `assets/sammies/${sammies[currentSammy][part]}/${part}.png`;
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

            if (currentSammy < 0)
             currentSammy = sammies.length;
            if (currentSammy >= sammies.length)
             currentSammy = 0;
            changeSammy();
        });
    });
});