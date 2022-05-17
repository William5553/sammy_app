const sammies = [
    'default',
    'drippy'
];

const prev = document.getElementById('arrow-prev');
const forw = document.getElementById('arrow-forw');

let currentSammy = 0;

const changeSammy = () => {
    [ 'head', 'body', 'legs' ].forEach(part => {
        const element = document.getElementById(`sammy-${part}`);
        element.src = `assets/sammies/${sammies[currentSammy]}/${part}.png`;
    });
};

prev.addEventListener('click', () => {
    currentSammy--;
    if (currentSammy < 0)
        currentSammy = sammies.length;
    changeSammy();
});

forw.addEventListener('click', () => {
    currentSammy++;
    if (currentSammy >= sammies.length)
        currentSammy = 0;
    changeSammy();
});