// dummy/merge-list/component

import Ember from 'ember';
import PortalDeclaration from 'ember-declarative/decl/ed-portal/mixin';

export default Ember.Component.extend(PortalDeclaration, {
  data: null,
  portalElementClass: 'merge-item',
  dataDidChange: Ember.observer('data.[]', function(){
    this.get('data').sort();
    this.notifyPropertyChange("dataChanged");
    this.rerender();
  })
});
