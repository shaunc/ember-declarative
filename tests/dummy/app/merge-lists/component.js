// dummy/merge-lists/component

import Ember from 'ember';
import DeclarationContainer from 'ember-declarative/ed-container/mixin';

export default Ember.Component.extend(DeclarationContainer, {

  merged: Ember.computed('declarations.@each.dataChanged', function() {
    const declarations = this.get('declarations');
    const merged = Ember.A();
    declarations.forEach((mlist, ilist)=>
      merged.addObjects(mlist.get('data').map(
        (item, index)=>({ilist, index, item}))));
    const smerged = merged.sortBy('item');
    console.log("merged", smerged.map(m=>m.item).join(" "));
    return smerged;
  })

});