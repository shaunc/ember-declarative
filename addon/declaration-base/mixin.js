// declaration-base mixin

import Ember from 'ember';
import DeclarationBlock from '../declaration-block/component';
import DeclarationContainer from '../declaration-container/mixin';

export default Ember.Mixin.create({
  declarationContainerClass: DeclarationBlock,
  declarationContainerMixin: DeclarationContainer,
  declarationContainer: null,
  declarationBlock: null,

  didInsertElement() {
    this._super();
    let parent = this.parentView;
    let containerClass = this.get('declarationContainerClass');
    let containerMixin = this.get('declarationContainerMixin');
    let declarationBlock;
    while (parent != null) {
      if (parent instanceof DeclarationBlock) {
        declarationBlock = parent;
      }
      if (containerClass != null && parent instanceof containerClass) {
        break;
      }
      if (containerMixin != null && containerMixin.detect(parent)) {
        break;
      }
      parent = parent.parentView;
    }
    if (parent != null) {
      Ember.run.scheduleOnce('sync', ()=> {
        this.set('declarationContainer', parent);
        this.set('declarationBlock', declarationBlock);
        if (parent.registerDeclaration != null) {
          parent.registerDeclaration(this);
        }
        this.didInsertDeclaration();
      });
    }
  },
  didUpdate() {
    this._super();
    Ember.run.scheduleOnce('afterRender', ()=>{
      this.didUpdateDeclaration();
    });
  },
  didInsertDeclaration() {
    //override to take action on initial insert;
  },
  didUpdateDeclaration() {
    // override to take action on rerender after registration.
    this.declarationContainer.declaractionsDidRerender();
  }

});