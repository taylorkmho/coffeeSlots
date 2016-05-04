import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el             = document.querySelector(selector);
    this.data           = data;
    this.slots          = Array.from(this.el.querySelectorAll('.slots__slot'));
    this.currentResults = [];

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
        iterate over caffeineData
          append data to container el
      */
      this.data.forEach((data, index)=>{
        let slotOption = document.createElement('div');
        addClass(slotOption, 'slots__option');
        slotOption.innerHTML = data.type + ' <span>' + data.components[slotIndex] + '</span>';
        slotContainer.appendChild(slotOption);
      })
      /*
        duplicate the first element for repeating animation
      */
      let firstEl = slotContainer.querySelector('.slots__option').cloneNode(true);
      slotContainer.appendChild(firstEl);
      /*
        set container el to random start position
      */
      let initNum           = randomBetween(0, this.data.length-1);
      this.slotOptionHeight = slotContainer.offsetHeight / slotContainer.childElementCount;

      slotEl.setAttribute('data-current-index', initNum);
      this.currentResults[slotIndex] = initNum;
      TweenMax.to(slotContainer, 1, {
        y: (initNum > 0) ? (-initNum * this.slotOptionHeight) + 'px' : (-this.data.length * this.slotOptionHeight) + 'px',
        delay: slotIndex * .125
      })
    });

    /*
      add click listener to spin button
    */
    this.spinHandler = () => {
      this.spinSlots();
    }
    this.addSpinListener = () => {
      this.el.querySelector('[data-action="spin"]').addEventListener('click', this.spinHandler, false);
      console.log('this.addSpinListener')
    }
    this.removeSpinListener = () => {
      this.el.querySelector('[data-action="spin"]').removeEventListener('click', this.spinHandler, false);
      console.log('this.removeClassSpinListener')
    }
    this.addSpinListener();
  }
  spinSlots() {
    this.removeSpinListener();

    console.log('🎰🎰🎰 slot spin 🎰🎰🎰');

    this.slots.forEach((slotEl,slotIndex)=>{
      let resultNum           = randomBetween(0, this.data.length-1);
      let slotsContainer      = slotEl.querySelector('.slots__container');

      let successHandler      = () => {
        console.log('all elements match');
      }
      let timeline            = new TimelineLite();

      this.currentResults[slotIndex] = resultNum;
      slotEl.setAttribute('data-current-index', resultNum);

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
        TweenLite.to(slotsContainer, .5, {
          y: (resultNum > 0) ? (-resultNum * this.slotOptionHeight) + 'px' : (-this.data.length * this.slotOptionHeight) + 'px',
          ease: 'easeOut',
          onComplete: () => {

            if (slotIndex === 2) {
              this.addSpinListener();
              if (this.currentResults[0] == this.currentResults[1] && this.currentResults[1] == this.currentResults[2]) {
                successHandler();
              }
            }

            // if this is the first slot
              // add active class to this slot
            // else
              // if each prior result has matched && this slot matches previous result
                // add active class to this slot

          }
        }
      ));
    })
  }
}