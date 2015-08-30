// dummy/merge-lists/render-item/component

import Ember from 'ember';
import { moveChildren } from 'ember-declarative/utils/dom-util';

export default Ember.Component.extend({
  
  didInsertElement() {
    let target = this.element;
    let {source, index} = this.get('item');
    let itemSource = source.element.getElementsByClassName('merge-item')[index];
    moveChildren(itemSource, target);

  }
});