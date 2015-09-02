// declarative-block/component

import Ember from 'ember';

export default Ember.Component.extend({
  isVisible: false,
/*
  didInsertElement() {
    Ember.run.scheduleOnce(
      'afterRender', this.parentView, 'declarationsDidRegister');
  },
  didUpdate() {
    Ember.run.scheduleOnce(
      'afterRender', this.parentView, 'declaractionsDidRerender');
  }
  */
});