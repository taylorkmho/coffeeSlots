import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el    = document.querySelector(selector);
    this.data  = data;
    this.slots = Array.from(this.el.querySelectorAll('.slots__slot'));

    this.initialize();
  }
  initialize() {
    this.slots.forEach((slotEl,slotIndex)=>{
      /*
        create container el
      */
      let slotContainer = document.createElement('div');
      addClass(slotContainer, 'slots__container');
      slotEl.appendChild(slotContainer);
      /*
        (2x) iterate over caffeineData
          append data to container el
      */
      for (let i=0; i<2; i++) {
        this.data.forEach((data)=>{
          let slotOption = document.createElement('div');
          addClass(slotOption, 'slots__option');
          slotOption.innerHTML = data.type + ' <span>' + data.components[slotIndex] + '</span>';
          slotContainer.appendChild(slotOption);
        })
      }
      /*
        set container el to random slotOption
      */
      let randomNum        = randomBetween(0,5);
      let heightSlotOption = slotContainer.offsetHeight / slotContainer.childElementCount;
      TweenMax.to(slotContainer, .25 * randomNum, {
        y: '-' + heightSlotOption * randomNum + 'px'
      })
    });
  }
}