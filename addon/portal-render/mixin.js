// ember-declarative/portal-render/mixin

import Ember from 'ember';
import { moveChildren, copyChildren } from 'ember-declarative/utils/dom-util';

export default Ember.Mixin.create({
  portal: null,
  portalIndex: 0,
  copyChildren: true,

  portalDidChange: Ember.observer('portal', function(){
    Ember.run.scheduleOnce('afterRender', this, 'port');
  }),
  didRender() {
    this.port();
  },
  port() {
    let target = this.element;
    let {portalIndex, portal} = this.getProperties('portalIndex', 'portal');
    if(portal == null) { return; }
    let source = portal.portElements()[portalIndex];
    let method = this.get('copyChildren') ? copyChildren : moveChildren;
    method(source, target, true);
  }

});