/**
 * @module ember-declarative/decl/ed-portal/mixin
 *
 * Mixin for declarations which render content.
 *
 */

import Ember from 'ember';
import DeclarationBase from '../ed-base/mixin';

export default Ember.Mixin.create(DeclarationBase, {

  /**
   * CSS class to use to filter own subnodes when porting content.
   *
   * @property portalElementClass
   * @type String
   */
  portalElementClass: null,
 
  portElements() {
    let elt = this.element;
    if (elt == null) { return; }
    let subClass = this.get('portalElementClass');
    if (subClass == null) {
      return elt.childNodes;
    }
    let subElements = elt.getElementsByClassName(subClass);
    return subElements || [];
  },
  portElement(idx) {
    return this.portElements()[idx];
  }
});