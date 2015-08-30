// dummy/merge-lists/component

import Ember from 'ember';

export default Ember.Component.extend({
  data: null,
  subLists: Ember.computed(function(){ return Ember.A(); }),

  merged: Ember.computed('data', 'subLists.[]', function() {
    let {data, subLists} = this.getProperties('data', 'subLists');
    let merged = [];
    for (let i = 0; i < subLists.length; i++) {
      let {list, source} = subLists[i];
      merged = merged.concat(data[list].map(function(item, index){
        return {list, item, index, source};
      }));
    }
    merged.sort(function(a, b) {
      if (a.item < b.item) { return -1; }
      if (a.item > b.item) { return 1; }
      return 0;
    });
    return merged;
  }),

  registerDeclaration(itemDecl) {
    Ember.run.scheduleOnce('afterRender', ()=>{
      this.get('subLists').pushObject({
        list: itemDecl.list, source: itemDecl});
    });
  }


});