// declarative-block/component

import Ember from 'ember';

export default Ember.Component.extend({
  isVisible: false,
  declarations: Ember.computed({
    get(){ return Ember.A(); }, set(k, v){ return v; }}),
  register: null,

  registerDeclaration(declaration) {
    this._super.apply(this, arguments);

    // Note: this purposely doesn't use "pushObject".
    // The intention is that registrations happen during "willRender",
    // and we don't want to interfere with the current render cycle.
    // 
    // Given that the dom tree is expanded depth-first, if the
    // implementation section follows the declarations, it should
    // have access to any declaration registrations.
    //
    let declarations = this.get('declarations');
    declarations.push(declaration);
    let register = this.get('register');
    if (register != null) {
      register(declaration, declarations);
    }
  }
  
});