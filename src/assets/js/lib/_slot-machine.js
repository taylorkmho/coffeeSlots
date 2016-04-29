import { addClass, removeClass, hasClass } from './_helpers';

export default class SlotMachine {
  constructor(selector, data) {
    this.el = document.querySelector(selector);
    this.data = data;

    this.initialize();
  }
  populateData() {
    /*
      for each slot element (from slots array)
        iterate over caffeineData
          append div containing data to slot element
    */
    let slots       = Array.from(this.el.querySelectorAll('.slots__slot'));
    slots.forEach((slotEl,slotIndex)=>{
      this.data.forEach((data)=>{
        let slotOption = document.createElement('div');
        addClass(slotOption, 'slots__option');
        slotOption.innerHTML = data.type + ' <span>' + data.components[slotIndex] + '</span>';
        slotEl.appendChild(slotOption);
      })
    });
  }
  initialize() {
    /*
      populate the data twice for looping animation
    */
    const repeatCount = 2;
    for (let i=0; i<repeatCount; i++)
      this.populateData();
  }
}