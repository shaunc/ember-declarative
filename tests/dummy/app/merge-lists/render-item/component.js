// dummy/merge-lists/render-item/component

import Ember from 'ember';
import PortalRender from 'ember-declarative/portal-render/mixin';

export default Ember.Component.extend(PortalRender, {

  portal: Ember.computed.alias('item.source')
});
