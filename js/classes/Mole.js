const currentMole = localStorage.getItem('mole') ?? 'musa';

export class Mole {
  constructor(moleId) {
    this.id = moleId;
    this.active = false;
    
    this.moleElem = document.createElement('div');
    this.moleElem.classList.add('mole');
    this.moleElem.id = moleId;
  
    this.doorImg = document.createElement('img');
    this.doorImg.src = './assets/whack-a-musa/closed.png';
    this.doorImg.classList.add('doorImg');
    this.doorImg.setAttribute('draggable', false);
  
    this.moleImg = document.createElement('img');
    this.moleImg.src = `./assets/moles/${currentMole}/mole.png`;
    this.moleImg.classList.add('moleImg');
    this.moleImg.dataset.active = false;
    this.moleImg.setAttribute('draggable', false);
  
    this.moleElem.append(this.doorImg);
    this.moleElem.append(this.moleImg);
  }
  
  setActive(active, delayOverride) {
    this.active = active;
    this.moleImg.src = active ? `./assets/moles/${currentMole}/mole.png` : `./assets/moles/${currentMole}/bonk.png`;
  
    setTimeout(() => {  
      this.moleImg.dataset.active = active;
      this.doorImg.src = active ? './assets/whack-a-musa/open.png' : './assets/whack-a-musa/closed.png';
      this.loseTimeout = undefined;
    }, delayOverride ?? (active ? 0 : 1000));
  }
}