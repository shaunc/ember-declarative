/**
 * @module ember-declarative/decl/ed-base/mixin
 *
 * Acts as "sentinel declaration": when registered,
 * triggers "allDeclarationsRegistered" event on the declaration
 * container.
 *
 */
 import Ember from 'ember';
 import DeclarationBase from 'ember-declarative/decl/ed-base/mixin';

 export default Ember.Component.extend(DeclarationBase, {

  sendAllRegistered: Ember.on('didRegisterDeclaration', function (container){
    container.trigger('allDeclarationsRegistered');
  })
 })