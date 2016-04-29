require('es6-shim');
import { addClass, removeClass, hasClass } from "./lib/_helpers";
require('./lib/_nodelist-shim');

let caffeineData = [
  {
    type: 'coffee',
    components: ['maker', 'filter', 'ground']
  },
  {
    type: 'tea',
    components: ['pot', 'strainer', 'loose']
  },
  {
    type: 'espresso',
    components: ['machine', 'tamper', 'ground']
  }
]

/*
  for each slot element (from slots array)
    iterate over caffeineData
      append div containing data to slot element
*/
let slots       = Array.from(document.querySelectorAll('.slots__slot'));
slots.forEach((slotEl,slotIndex)=>{
  caffeineData.forEach((data)=>{
    let slotOption = document.createElement('div');
    addClass(slotOption, 'slots__option');
    slotOption.innerHTML = data.type + ' <span>' + data.components[slotIndex] + '</span>';
    slotEl.appendChild(slotOption);
  })
})