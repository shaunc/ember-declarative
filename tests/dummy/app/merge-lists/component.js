// dummy/merge-lists/component

import Ember from 'ember';
import DeclarationContainer from 'ember-declarative/ed-container/mixin';

export default Ember.Component.extend(DeclarationContainer, {

  merged: Ember.computed('declarations.@each.data.[]', function() {
    const declarations = this.get('declarations');
    let merged = [];
    for(let i = 0; i < declarations.length; i++) {
      const mlist = declarations[i];
      merged = merged.concat(mlist.get('data').map((item, index)=>{
        return {list: i, index, item};
      }));
    }
    merged.sort(function(a, b) {
      if (a.item < b.item) { return -1; }
      if (a.item > b.item) { return 1; }
      return 0;
    });
    return merged;
  })

});