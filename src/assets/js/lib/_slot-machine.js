import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el    = document.querySelector(selector);
    this.data  = data;
    this.slots = Array.from(this.el.querySelectorAll('.slots__slot'));

    this.initialize();
    this.addClickListeners();
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
      let randomNum         = randomBetween(0,2);
      this.slotOptionHeight = slotContainer.offsetHeight / slotContainer.childElementCount;

      slotEl.setAttribute('data-current', randomNum);
      if (randomNum !== 0) {
        TweenMax.to(slotContainer, .75 * randomNum, {
          y: '-' + this.slotOptionHeight * randomNum + 'px'
        })
      }
    });
  }
  addClickListeners() {
    let spinButton = this.el.querySelector('[data-action="spin"]');
    spinButton.addEventListener('click', ()=>{
      this.spinSlots();
    }, false);
  }
  spinSlots() {
    this.slots.forEach((slotEl,slotIndex)=>{
      let stepsMoved          = 3 - parseInt(slotEl.getAttribute('data-current'));
      let randomNum           = randomBetween(0,2);
      let slotsContainer      = slotEl.querySelector('.slots__container');
      let timeline            = new TimelineLite();

      slotEl.setAttribute('data-current', randomNum);
      timeline.add(
        TweenLite.to(slotsContainer, .06125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'easeIn',
          clearProps: 'y',
          onComplete: function() {
            console.log('🔥🔥 onComplete - finish cycle 🔥🔥')
            if (slotEl.style.border == ''){
              slotEl.style.border = '2px solid red';
            } else {
              slotEl.style.border = '';
            }
          }
        }
      ));
      timeline.add(
        TweenLite.to(slotsContainer, .125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'easeNone',
          clearProps: 'y'
        }
      ));
      timeline.add(
        TweenLite.to(slotsContainer, .25, {
          y: (-randomNum * this.slotOptionHeight) + 'px',
          ease: 'easeOut'
        }
      ));
    })
  }
}