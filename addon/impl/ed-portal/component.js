/**
 * @module ember-declarative/impl/ed-portal/component
 *
 */
import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
  layout: layout,
  portal: null,
  portalIndex: null,
  defaultValue: null
});
