// declaration-base mixin

import Ember from 'ember';
import DeclarationContainer from '../declaration-container/mixin';

export default Ember.Mixin.create({
  /**
   * Class in `parentView` chain with which to register ourselves.
   * 
   * Alternative to `declarationContainerMixin`, which takes precedence
   * if set.
   */
  declarationContainerClass: null,
  /**
   * Mixin which the instance in `parentView` chain with which we
   * should register ourselves should support.
   *
   */
  declarationContainerMixin: DeclarationContainer,
  /**
   * Instance in `parentView` chain with which we are registered.
   *
   * Set during `didReceiveAttrs`.
   */
  declarationContainer: null,

  didReceiveAttrs() {
    this._super();
    let declarationContainer = this.findDeclarationContainer();
    if (declarationContainer != null) {
      this.set('declarationContainer', declarationContainer);
      declarationContainer.registerDeclaration(this);
      this.didRegisterDeclaration();
    }
  },
  /**
   * Override to act on container registration.
   */
  didRegisterDeclaration() {
    // 
  },
  /**
   * Call to trigger explicit update.
   *
   * Override to give behavior. (`PortalDeclaration` gives
   * an implementation.)
   */
  updateDeclaration() {
    // 
    //
    // 
  },
  findDeclarationContainer() {
    let containerClass = this.get('declarationContainerClass');
    let containerMixin = this.get('declarationContainerMixin');
    let parent = this.parentView; 
    while (parent != null) {
      if (containerClass != null && parent instanceof containerClass) {
        return parent;
      }
      if (containerMixin != null && containerMixin.detect(parent)) {
        return parent;
      }
      parent = parent.parentView;
    }
  }

});