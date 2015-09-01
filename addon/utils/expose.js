// ember-declarative/utils/expose.js

import Ember from 'ember';

export function exposeElement(element, item, className, attribute) {
  if (element == null || item == null) { return; }
  let itemElement = element.getElementsByClassName(className)[0];
  Ember.set(item, attribute, itemElement);
}
export function exposeElementList(element, items, className, attribute) {
  if (element == null || items == null) { return; }
  let itemElements = element.getElementsByClassName(className);
  Array.prototype.forEach.call(itemElements, (elt, index)=>{
    let item = items[index];
    if (item != null) {
      Ember.set(item, attribute, elt);
    }
  });
}
