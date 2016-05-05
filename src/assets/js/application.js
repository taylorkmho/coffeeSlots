require('es6-shim');
require('./lib/_nodelist-shim');
import SlotMachine from './lib/_slot-machine';

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

window.slotMachine = new SlotMachine('.slots', '.slot-machine', caffeineData);