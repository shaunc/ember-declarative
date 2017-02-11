/**
 * @module ember-declarative/decl/ed-portal/mixin
 *
 * Mixin for declarations which render content; manages "teleportation" 
 * of content to receivers (`impl/ed-render`).
 * 
 * Receivers can either receive subelements of content by index, or
 * they can receive all content of given type.
 *
 * The correspondence between content and receivers must be managed
 * cooperatively, as content can change on this end (e.g. responding
 * to data changes), and receivers also might change what data they want
 * (e.g. responding to user action or window events).
 *
 * To setup a connection, a receiver should call `portElements` (to
 * receive all content), or `portElement` (to receive content at an
 * index). 
 *
 * This updates the ported element list, calling `updateElements`, 
 * registers the receiver, and returns the content to it.
 *
 * In response to render, updateElements is also called.
 *
 * The `updateElements` routine reconciles the old elements with new
 * elements, working with registerd receivers to update their state
 * for any added, deleted or changed elements.
 *
 * TODO: maintaining content-receiver correspondence by array index
 * may result in a lot of churn. A more general system that could
 * avoid this would be to allow correpondence via guid.
 */

import Ember from 'ember';
import DeclarationBase from '../ed-base/mixin';

export default Ember.Mixin.create(DeclarationBase, {

  /**
   * CSS class to use to filter own subnodes when porting content.
   *
   * @property portalElementClass
   * @type String
   */
  portalElementClass: null,
  
  init() {
    this._super();
    this.subElements = [];
    this.newElements = null;
    this.receivedWhole = null;
  },
  _portalRendered: Ember.on('didRender', function(){
    this.processPortalElements();
  }),
  processPortalElements() {
    const newElements = this._getElements();
    this._updateElements(newElements);
  },
 
  _getElements() {
    if(this.newElements != null) {
      return this.newElements;
    }
    let elt = this.element;
    if (elt == null) { return; }
    let subClass = this.get('portalElementClass');
    let subElements = ((subClass == null) ? elt.childNodes 
      : elt.getElementsByClassName(subClass)) || [];
    this.newElements = subElements;
    return subElements;
  },
  portElements(receiver) {
    const prevReceiver = this.receivedWhole;
    if(prevReceiver === receiver) { return; }
    this.receivedWhole = receiver;
    if (prevReceiver != null) {
      const {content: prevContent} = prevReceiver.swapContent();
      this.putBackContent(prevContent);
    }
    const content = this._getElements();
    this._takeDOM(content, receiver);
    return content;
  },
  portElement(receiver, idx) {
    if(this.receivedWhole != null) {
      throw new Error("Previously ported whole; cannot now port parts.");
    }
    const prevReceiver = (this.subElements[idx] || {}).receiver;
    if(prevReceiver === receiver) { return; }
    if(prevReceiver != null) {
      const {content: prevContent} = prevReceiver.swapContent();
      this.putBackContent(prevContent, idx);
    }
    const newContent = this._getElements()[idx];
    if(newContent == null) {
      // XXX TODO: here perhaps create placeholder "waiting for index?"
      return null;
    }
    if(newContent.returnedContent != null) {
      return newContent.returnedContent;      
    }
    this._takeDOMIdx(newContent, receiver, idx);
    return newContent;
  },
  putBackContent(content, idx) {
    if(this.isDestroying) { return; }
    if(idx == null) {
      this._putBackDOM(content);
    }
    else {
      this._putBackDOMIdx(content, idx);
    }
  },

  /**
   * Maintain state to reflect changed element list.
   *
   * Content is addressed by index, so we process
   * the change "slot-wise": we inform receiver
   * if element at slot has been added, removed or changed.
   * 
   */
  _updateElements(newElements) {
    const oldElements = this.subElements || [];
    let idx;
    for(idx = 0; idx < oldElements.length; idx++) {
      const oldElement = oldElements[idx];
      if(oldElement == null) {
        // can be that some elements had no content
        continue;
      }
      const destination = oldElement.receiver;
      if (idx >= newElements.length) {
        if(destination != null) {
          destination.forgetContent(this);
          oldElement.receiver = null;
        }
        continue;
      }
      const newElement = newElements[idx];
      if(oldElement !== newElement && destination != null) {
        newElements[idx] = this._sendToRender(destination, newElement, idx);
      }
    }
    /* TODO: do we need to create placeholders for receivers for 
       not-yet-existing elements?
    for (; idx < newElements.length; idx++) {
      const destination = this.receivers[idx];
      if(destination != null) {
        newElements[idx] = this._sendToRender(destination, newElements[idx], idx);
      }
    }
    */
    this.subElements = newElements;
    this.newElements = null;
  },
  _sendToRender(destination, element, idx) {
    if(element.isPlaceholder) {
      if(element.returnedContent != null) {
        element = element.returnedContent;
      }
      else {
        const source = element.receiver;
        if(source === destination) { return; }
        let {content: oldElement} = source.swapContent();
        element = oldElement;
      }
    }
    const {content, portal, portalIndex} = destination.swapContent({
      newContent: element, newPortal: this, newPortalIndex: idx});
    if(portal !== null) {
      portal.putBackContent(content, portalIndex);
    }
    if(!element.isPlaceholder) {
      return this._takeDOMIdx(element, destination, idx);
    }
    return element;
  },
  _takeDOM(content, receiver) {
    for(let i = 0; i < content.lengh; i++) {
      this._takeDOMIdx(content[i], receiver, i);
    }
  },
  _takeDOMIdx(contentElt, receiver, idx) {
    if(contentElt == null) { return; }
    const cls = this.get('portalElementClass');
    const placeholder = document.createElement("DIV");
    placeholder.isPlaceholder = true;
    placeholder.returnedContent = null;
    placeholder.receiver = receiver;
    if(cls != null) {
      placeholder.setAttribute('class', cls);
    }
    contentElt.parentElement.replaceChild(placeholder, contentElt);
    this.subElements[idx] = placeholder;
    return placeholder;
  },
  _putBackDOM(content) {
    for(let i = 0; i < content.lengh; i++) {
      this._putBackDOMIdx(content[i], i);
    }
  },
  _putBackDOMIdx(contentElt, idx) {
    const placeholder = this.subElements[idx];
    placeholder.receiver = null;
    placeholder.returnedContent = contentElt;
  }
});