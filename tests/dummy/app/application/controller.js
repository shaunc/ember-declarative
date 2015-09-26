/* GLOBALS chance */
// dummy/application/controller

import Ember from 'ember';

function getName(gender) {
  return chance.first({gender});
}
function getNames(gender, i) {
  let a = Ember.A(Array.apply(null,new Array(i)).map(()=>getName(gender)));
  return a;
}

export default Ember.Controller.extend({

  males: Ember.computed(function(){
    return getNames('male', 10);
  }),
  females: Ember.computed(function(){
    return getNames('female', 10);
  })

});
