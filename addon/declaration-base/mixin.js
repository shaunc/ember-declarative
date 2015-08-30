// declaration-base mixin

import Ember from 'ember';
import DeclarationBlock from '../declaration-block/component';

export default Ember.Mixin.create({
  declarationContainerClass: DeclarationBlock,
  declarationContainer: null,

  didInsertElement() {
    this._super();
    let parent = this.parentView;
    let containerClass = this.get('declarationContainerClass');
    while (parent != null) {
      if (parent instanceof containerClass) {
        this.declarationContainer = parent;
        parent.registerDeclaration(this);
        break;
      }
      parent = parent.parentView;
    }
  }

});