// ember-declarative/declaration-container/mixin

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
    let register = this.get('register');
    if (register != null) {
      register(declaration, declarations);
    }
  },

  declarationsDidRegister() {
    this.set('declarationsRegistered', true);
    this.rerender();
  },
  declaractionsDidRerender() {
    this.incrementProperty('declarationsUpdated');
    console.log('updated', this.get('declarationsUpdated'));
  }

});