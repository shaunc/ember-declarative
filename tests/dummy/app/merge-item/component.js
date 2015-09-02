// dummy/merge-item/component

import Ember from 'ember';
import PortalDeclaration from 'ember-declarative/portal-declaration/mixin';

export default Ember.Component.extend(PortalDeclaration, {
  list: null,
  data: Ember.computed.alias('declarationContainer'),

  menu: Ember.computed.alias('declarationContainer.subList'),
  watchAttribute: Ember.computed('list', function(){
    let list = this.get('list');
    return 'data.' + list;
  }),
  subList: Ember.computed(
      'declarationContainer', 'watchAttribute', function(){
    let attr = this.get('watchAttribute');
    let container = this.get('declarationContainer');
    if (container == null) { return; }
    return container.get(attr);
  }),
  notifyAttribute: Ember.computed.alias('watchAttribute'),
  portalContainer: Ember.computed.alias('subList'),
  portalAttribute: 'source',
  portalElementClass: 'merge-item'
});
