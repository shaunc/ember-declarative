/**
 * @module ember-declarative/decl/ed-block/component
 *
 * Wrapper for declarations. Makes sure declarations are hidden,
 * and includes `ed-end-block` "sentinel" declaration to mark
 * completion of declaration registration.
 */

import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  isVisible: false,

});