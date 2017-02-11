// dummy/merge-lists/component

import Ember from 'ember';
import EDContainerMixin from 'ember-declarative/ed-container/mixin';

export default Ember.Component.extend(EDContainerMixin, {

  merged: Ember.computed('declarations.@each.dataChanged', function() {
    const declarations = this.get('declarations');
    const merged = Ember.A();
    declarations.forEach((mlist, ilist)=>{
      const data = mlist.get('data');
      if(data != null) {
        merged.addObjects(data.map(
          (item, index)=>({ilist, index, item})))
      }
    });
    const smerged = merged.sortBy('item');
    return smerged;
  })

});