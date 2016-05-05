require('es6-shim');
require('./lib/_nodelist-shim');
import {App} from './lib/_slot-machine';

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

let app = new App('.slots', '.slot-machine', caffeineData);