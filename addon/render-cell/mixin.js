// ember-declarative/declaration-render-cell/mixin

import Ember from 'ember';
import { moveChildren, copyChildren } from 'ember-declarative/utils/dom-util';

export default Ember.Mixin.create({

  /** DOM element to copy from. Should be overridden with actual element.
   *
   */
  source: null,
  copyChildren: true,

  didRender() {
    let source = this.get('source');
    if(source != null) {
      let target = this.element;
      console.log(
        "RENDER; copy", this.get('copyChildren'), 
        source.innerText.replace(/\s+/g, ' '));
      if (this.get('copyChildren')) {
        copyChildren(source, target, true);
      } else {
        moveChildren(source, target, true);
      }
    }
  }
});
