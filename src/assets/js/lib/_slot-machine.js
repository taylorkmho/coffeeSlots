import { addClass, removeClass, hasClass, randomBetween } from './_helpers';

export class App {
  constructor(slotsSelector, graphicSelector, caffeineData) {
    window.slotMachine = new SlotMachine(slotsSelector, caffeineData);
    window.slotGraphic = new SlotGraphic(graphicSelector, slotsSelector);
  }
}

class SlotMachine {
  constructor(selector, data) {
    this.el             = document.querySelector(selector);
    this.data           = data;
    this.slots          = Array.from(this.el.querySelectorAll(selector + '__slot'));
    this.button         = document.querySelector('[data-action="spin"]');
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
        slotOption.innerHTML = ' <span><strong>' + data.type + '</strong>' + data.components[slotIndex] + '</span>';
        slotOption.setAttribute('data-type', data.type)
        slotContainer.appendChild(slotOption);
      })
      /*
        duplicate the first element for repeating animation
      */
      let firstEl = slotContainer.querySelector('.slots__option').cloneNode(true);
      slotContainer.appendChild(firstEl);
    });

    /*
      add click listener to spin button
    */
    let spinHandler = () => {
      this.spinSlots();
    }
    this.addSpinListener = () => {
      this.button.addEventListener('click', spinHandler, false);
      console.log('this.addSpinListener')
    }
    this.removeSpinListener = () => {
      this.button.removeEventListener('click', spinHandler, false);
      console.log('this.removeClassSpinListener')
    }
    this.addSpinListener();

    /*
      randomize slots on load and resize
      prevents funky layout for mobile slots
    */
    this.randomizeSlots(true);
    window.addEventListener('resize', ()=>{
      setTimeout(()=>{
        this.randomizeSlots(false);
      }, 500)
    })
  }
  randomizeSlots(animate) {
    this.slots.forEach((slotEl,slotIndex)=>{
      let initNum           = randomBetween(0, this.data.length-1);
      let slotContainer     = slotEl.querySelector('.slots__container');
      this.slotOptionHeight = slotContainer.offsetHeight / slotContainer.childElementCount;

      slotEl.setAttribute('data-current-index', initNum);
      this.currentResults[slotIndex] = initNum;
      TweenMax.fromTo(slotContainer, 1,
        {
          y: 0,
          opacity: 0
        },
        {
          y: (initNum > 0) ? (-initNum * this.slotOptionHeight) + 'px' : (-this.data.length * this.slotOptionHeight) + 'px',
          opacity: 1,
          delay: slotIndex * .125
        }
      )
    })
  }
  spinSlots() {
    console.log('🎰🎰🎰 slot spin 🎰🎰🎰');

    this.removeSpinListener();

    this.slots.forEach((slotEl,slotIndex)=>{
      let resultNum           = randomBetween(0, this.data.length-1);
      let slotsContainer      = slotEl.querySelector('.slots__container');
      let resultType          = slotsContainer.querySelectorAll('.slots__option')[resultNum].getAttribute('data-type');
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
              if (this.currentResults[0] == this.currentResults[1] && this.currentResults[1] == this.currentResults[2]) {
                window.slotGraphic.win(resultType);
              } else {
                this.addSpinListener();
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
  constructor(selector, slotsSelector) {
    this.el           = document.querySelector(selector);
    this.slotsEl      = document.querySelectorAll(slotsSelector + '__slot');
    this.animDuration = 10;
  }
  win(resultType) {
    /*
      Add class based on winning caffeine type
    */
    addClass(this.el, resultType);

    /*
      Animate shake
    */
    let shakeMachine    = TweenMax.fromTo(this.el, this.animDuration/100,
      {
        x: '0'
      },
      {
        x: '2px',
        repeat: 100 * (7/8),
        delay: this.animDuration / 8,
        clearProps: 'x'
      }
    );

    /*
      Animate display
    */
    let timelineDisplay = new TimelineLite();
    let displayEl       = this.el.querySelector('.slot-machine__display rect');
    let fillDisplay     = TweenMax.fromTo(displayEl, this.animDuration/8,
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    );
    let expelDisplay    = TweenMax.fromTo(displayEl, (this.animDuration*7)/8,
      {
        height: displayEl.getAttribute('height'),
        y: 0
      },
      {
        height: '0',
        y: displayEl.getAttribute('height')
      }
    );

    timelineDisplay
      .add(fillDisplay)
      .add(expelDisplay);

    /*
      Animate pour
    */
    let timelineGraphic = new TimelineLite();
    let flowBaseEl      = this.el.querySelector('.slot-machine__flow rect');
    let flowBubblesEl   = this.el.querySelectorAll('.slot-machine__flow circle');

    let animPourIn      = TweenLite.fromTo(flowBaseEl, this.animDuration/8,
      {
        opacity: 0,
        height: 0,
        y: '0%'
      },
      {
        opacity: .5,
        height: flowBaseEl.getAttribute('height'),
        y: '0%',
        delay: this.animDuration/8
      }
    );

    let animBubbleIn    = TweenMax.staggerFromTo(flowBubblesEl, this.animDuration/4,
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

    let animBubbleOut   = TweenLite.to(flowBubblesEl, this.animDuration/4,
      {
        opacity: 0,
        y: '200%',
        clearProps: 'opacity, y'
      }
    );

    let animPourOut      = TweenLite.to(flowBaseEl, this.animDuration/8,
      {
        opacity: 0,
        y: flowBaseEl.getAttribute('height'),
        height: 0,
        clearProps: 'opacity, y, height',
        onComplete: () => {
          window.slotMachine.addSpinListener();
          removeClass(this.el, resultType);
        }
      }
    );

    timelineGraphic
      .add(animPourIn)
      .add(animBubbleIn)
      .add(animBubbleOut)
      .add(animPourOut);
  }
}