/** 
 * @module ember-declarative/ed-container/mixin 
 *
 * mixin for main declaration container class, whose template
 * yields for declarations and then renders implementation.
 *
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  declarations: Ember.computed({
    get(){ return Ember.A(); }, set(k, v){ return v; }}),
  register: null,
  
  registerDeclaration(declaration) {
    let declarations = this.get('declarations');
    declarations.pushObject(declaration);
  },

});