import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el    = document.querySelector(selector);
    this.data  = data;
    this.slots = Array.from(this.el.querySelectorAll('.slots__slot'));

    this.spinHandler = () => {
      this.spinSlots();
    }
    this.addSpinListener = () => {
      console.log('adding spin button listener');
      this.el.querySelector('[data-action="spin"]').addEventListener('click', this.spinHandler, false);
    }
    this.removeSpinListener = () => {
      console.log('removing spin button listener');
      this.el.querySelector('[data-action="spin"]').removeEventListener('click', this.spinHandler, false);
    }

    this.initialize();
  }
  initialize() {
    this.slots.forEach((slotEl,slotIndex)=>{
      /*
        create slot container el
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
      let randomNum         = randomBetween(0,2);
      this.slotOptionHeight = slotContainer.offsetHeight / slotContainer.childElementCount;

      slotEl.setAttribute('data-current-index', randomNum);
      if (randomNum !== 0) {
        TweenMax.to(slotContainer, .75 * randomNum, {
          y: '-' + this.slotOptionHeight * randomNum + 'px'
        })
      }
    });

    /*
      add click listener to spin button
    */
    this.addSpinListener();
  }
  spinSlots() {
    this.removeSpinListener();

    this.slots.forEach((slotEl,slotIndex)=>{
      let randomNum           = randomBetween(0,2);
      let slotsContainer      = slotEl.querySelector('.slots__container');
      let timeline            = new TimelineLite();

      slotEl.setAttribute('data-current-index', randomNum);
      timeline.add(
        TweenLite.to(slotsContainer, .06125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'easeIn',
          clearProps: 'y',
          delay: slotIndex
        }
      ));
      timeline.add(
        TweenMax.to(slotsContainer, .125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'none',
          clearProps: 'y',
          repeat: 20
        }
      ));
      timeline.add(
        TweenLite.to(slotsContainer, .5 , {
          y: (-randomNum * this.slotOptionHeight) + 'px',
          ease: 'easeOut',
          onComplete: () => {
            if (parseInt(slotEl.getAttribute('data-slot')) === 2) {
              this.addSpinListener();
            }
          }
        }
      ));
    })
  }
}