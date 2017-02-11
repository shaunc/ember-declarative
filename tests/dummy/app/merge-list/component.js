// dummy/merge-list/component

import Ember from 'ember';
import EDPortalMixin from 'ember-declarative/decl/ed-portal/mixin';

export default Ember.Component.extend(EDPortalMixin, {
  data: null,
  portalElementClass: 'merge-item',
  dataDidChange: Ember.observer('data.[]', function(){
    this.get('data').sort();
    this.notifyPropertyChange("dataChanged");
    this.rerender();
  })
});
