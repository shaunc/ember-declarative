/**
 * @module ember-declarative/decl/ed-base/mixin
 *
 * Mixin for declarations. Base of ed/decl/portal/mixin for declarations
 * which render content.
 *
 */

import Ember from 'ember';
import DeclarationContainer from '../../ed-container/mixin';

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

  _declAttrsChanged: Ember.on('didReceiveAttrs', function() {
    this.registerDeclarationWithContainer();
  }),
  registerDeclarationWithContainer() {
    this._super();
    let declarationContainer = this.findDeclarationContainer();
    if (declarationContainer != null) {
      this.set('declarationContainer', declarationContainer);
      declarationContainer.registerDeclaration(this);
      this.trigger('didRegisterDeclaration', declarationContainer);
    }
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