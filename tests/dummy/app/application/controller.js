// dummy/application/controller

import Ember from 'ember';


import Chance from 'npm:chance';

const chance = new Chance(345);

function getName(gender) {
  return chance.first({gender});
}
function getNames(gender, i) {
  let a = Ember.A(Array.apply(null,new Array(i)).map(()=>getName(gender)));
  a.sort();
  return a;
}
const maxLength = 10;

export default Ember.Controller.extend({

  males: Ember.computed(function(){
    return getNames('male', maxLength/2);
  }),
  females: Ember.computed(function(){
    return getNames('female', maxLength/2);
  }),

  init() {
    this._super();
    Ember.run.later(this, 'changeName', 1000);
  },
  changeName() {
    const gender = chance.bool() ? 'male' : 'female';
    const list = this.get(gender + 's');
    const minAction = (list.length >= maxLength) ? 1 : 0;
    const maxAction = (list.length <= 1) ? 1 : 2;
    const action = chance.integer({min: minAction, max: maxAction});
    const newName = getName(gender);
    if(action === 0) {
      const index = chance.integer({min: 0, max: list.length});
      if (index < list.length) {
        list.insertAt(index, newName);
      }
      else {
        list.pushObject(newName);
      }
    }
    else if (action === 1) {
      const index = chance.integer({min: 0, max: list.length - 1});
      list.replace(index, 1, newName);
    }
    else {
      const index = chance.integer({min: 0, max: list.length - 1});
      list.removeAt(index, 1);
    }
    Ember.run.later(this, 'changeName', 1000);
  }

});
