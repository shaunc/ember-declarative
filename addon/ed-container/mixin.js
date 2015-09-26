/** 
 * @module ember-declarative/ed-container/mixin 
 *
 * mixin for main declaration container class, whose template
 * yields for declarations and then renders implementation.
 *
 */

import Ember from 'ember';

export default Ember.Mixin.create({

  declarationsRegistered: false,
  declarationsUpdatedOnce: 0,
  declarations: Ember.computed({
    get(){ return Ember.A(); }, set(k, v){ return v; }}),
  register: null,
  
  registerDeclaration(declaration) {
    let declarations = this.get('declarations');
    declarations.push(declaration);
    this.sendAction('register', declaration, declarations);
  },

  declarationsDidRegister() {
    this.set('declarationsRegistered', true);
  },
  declaractionsDidRerender() {
    this.incrementProperty('declarationsUpdated');
  }

});