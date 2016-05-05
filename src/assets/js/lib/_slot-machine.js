import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el             = document.querySelector(selector);
    this.data           = data;
    this.slots          = Array.from(this.el.querySelectorAll('.slots__slot'));
    this.graphic        = new SlotGraphic('.slot-machine');
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
        slotOption.setAttribute('data-type', data.type)
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
    console.log('🎰🎰🎰 slot spin 🎰🎰🎰');

    this.removeSpinListener();

    this.slots.forEach((slotEl,slotIndex)=>{
      let resultNum           = randomBetween(0, this.data.length-1);
      let slotsContainer      = slotEl.querySelector('.slots__container');
      let timelineSlot        = new TimelineLite();

      let animStart           = TweenLite.to(slotsContainer, .125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'easeIn',
          clearProps: 'y',
          delay: slotIndex
      });
      let animMid             = TweenMax.to(slotsContainer, .125, {
          y: (-3 * this.slotOptionHeight) + 'px',
          ease: 'none',
          clearProps: 'y',
          repeat: 20
      });
      let animFinish          = TweenLite.to(slotsContainer, .5, {
          y: (resultNum > 0) ? (-resultNum * this.slotOptionHeight) + 'px' : (-this.data.length * this.slotOptionHeight) + 'px',
          ease: 'easeOut',
          onComplete: () => {
            if (slotIndex === 2) {
              this.addSpinListener();
              if (this.currentResults[0] == this.currentResults[1] && this.currentResults[1] == this.currentResults[2]) {
                this.graphic.win();
              }
            }
          }
      })

      this.currentResults[slotIndex] = resultNum;
      slotEl.setAttribute('data-current-index', resultNum);

      timelineSlot
        .add(animStart)
        .add(animMid)
        .add(animFinish);
    })
  }
}

class SlotGraphic {
  constructor(selector) {
    this.el = document.querySelector(selector);
  }
  win() {
    let shakeMachine    = TweenMax.fromTo(this.el, .0625,
      {
        x: '-1px'
      },
      {
        x: '1px',
        repeat: 70
      }
    )

    let timelineGraphic = new TimelineLite();
    let flowBaseEl      = this.el.querySelector('.slot-machine__flow rect');
    let animPourIn      = TweenLite.fromTo(flowBaseEl, .5,
      {
        opacity: 0,
        height: 0,
        y: '0%'
      },
      {
        opacity: .5,
        height: flowBaseEl.getAttribute('height'),
        y: '0%'
      }
    );
    let animPourOut      = TweenLite.to(flowBaseEl, 1.5,
      {
        opacity: 0,
        y: flowBaseEl.getAttribute('height'),
        height: 0,
        clearProps: 'opacity, y, height'
      }
    );

    let flowBubblesEl   = this.el.querySelectorAll('.slot-machine__flow circle');
    let animBubbleIn    = TweenMax.staggerFromTo(flowBubblesEl, 1,
      {
        opacity: 0,
        y: '0%'
      },
      {
        opacity: 1,
        y: '100%'
      },
      .125
    );
    let animBubbleOut   = TweenLite.to(flowBubblesEl, 1,
      {
        opacity: 0,
        y: '200%',
        clearProps: 'opacity, y'
      }
    );

    timelineGraphic
      .add(animPourIn)
      .add(animBubbleIn)
      .add(animBubbleOut)
      .add(animPourOut);
  }
}