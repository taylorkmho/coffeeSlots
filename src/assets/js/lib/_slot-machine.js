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
    let slotMatchArray = [null, null, null];

    this.slots.forEach((slotEl,slotIndex)=>{
      let newOptionNum        = randomBetween(0,2);
      let slotsContainer      = slotEl.querySelector('.slots__container');
      let thisSlotNum         = parseInt(slotEl.getAttribute('data-slot'));
      let prevSlotEl = this.el.querySelectorAll('.slots__slot')[thisSlotNum-1];
      let prevElNum = prevSlotEl ? parseInt(prevSlotEl.getAttribute('data-current-index')) : null;
      let matchPrev = newOptionNum === prevElNum;

      let timeline            = new TimelineLite();

      slotEl.setAttribute('data-current-index', newOptionNum);
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
          y: (-newOptionNum * this.slotOptionHeight) + 'px',
          ease: 'easeOut',
          onComplete: () => {

            console.log('🎰 ' + thisSlotNum);
            if (thisSlotNum == 0) {
              slotMatchArray[thisSlotNum] = true;
            } else {
              if (matchPrev) {
                slotMatchArray[thisSlotNum] = true;
              } else {
                slotMatchArray[thisSlotNum] = false;
              }
            }
            console.log(slotMatchArray);

            if (thisSlotNum === 2) {
              this.addSpinListener();
            }

          }
        }
      ));
    })
  }
}