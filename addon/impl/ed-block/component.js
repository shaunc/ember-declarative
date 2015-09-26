/**
 * @module ember-declarative/impl/ed-block/component
 *
 * Wrapper around implementation. Delays display of wrapped
 * implementation until declarations have been updated.
 *
 */

import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout
  
});