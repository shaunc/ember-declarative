// dummy/merge-item/component

import Ember from 'ember';
import DeclarationBase from 'ember-declarative/declaration-base/mixin';
import MergeLists from '../merge-lists/component';

export default Ember.Component.extend(DeclarationBase, {
  declarationContainerClass: MergeLists,

  subList: null,

  didInsertElement() {
    this._super();
    Ember.run.scheduleOnce('afterRender', ()=>{
      let subList = this.declarationContainer.data[this.list];
      this.set('subList', subList);
    });
  }
});