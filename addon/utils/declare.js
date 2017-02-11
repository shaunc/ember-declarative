/**
  @module utils/declare

  Declarative component utilities.
*/
import Ember from 'ember';

/**
  Used at class scope in DeclarationContainerMixin, returns a computed
  property that gets first declaration of given class.

  Assumes that property `declarations` collects all declarations.
*/
export function declarationFor(cls) {
  return Ember.computed('declarations.[]', function(){
    let matching;
    (this.get('declarations') || []).some((decl)=>{
      if (decl instanceof cls) {
        matching = decl;
        return true;
      }
    });
    return matching;
  });
}