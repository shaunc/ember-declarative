/**
 * @module ember-declarative/impl/ed-render/helper
 *
 * Helper to render content from declarations into implementation.
 *
 * Arguments: `declarations name itemIndex itemSubindex`, where:
 *
 * @param [declarations]: list of all declarations. Omit if `portal` is
 *   specified.
 *
 * @param [params.name] -- class name to filter declarations by; optional (skipped
 *   if first argument a number). Omit if `portal` is specified. If
 *   first argument after declarations is a number, skipped (declarations
 *   not filtered).
 *   Should either be dasherized name of declarative component (e.g. 
 *   `merge-list`), or a css class.
 * 
 * @param [itemIndex] -- which of the declarations of class to reference. Omit
 *   if `portal` is specified.
 *   
 * @param [itemSubIndex] -- to pass to portal interface to get rendered content
 *   Optional; default 0. pass as `null` to get all elements.
 *
 * Keyword arguments: 
 *
 * @param [options.defaultValue] -- default if content not present.
 *
 * @param [options.portal] -- portal instance (instead of 
 *   `declarations`, `name` and `itemIndex`).
 *
 * Cooperates with `ember-declarative/decl/ed-portal` to maintain
 * correspondence between content as declared and content implementation.
 */

import Ember from 'ember';

export default Ember.Helper.extend({

  init() {
    this._super();
    this.portal = null;
    this.portalIndex = null;
    this.content = null;
  },

  compute(
      [declarations, name, itemIndex, newPortalIndex], {defaultValue, portal}) {
    if(portal == null) {
      if (typeof name === 'number') {
        newPortalIndex = itemIndex;
        itemIndex = name;
        name = null;
      }
      const portals = this._getPortals(declarations, name);
      portal = portals[itemIndex];
    }
    else {
      newPortalIndex = declarations;
    }
    let oldPortal = this.portal;
    let oldPortalIndex = this.portalIndex;
    if(portal === oldPortal && newPortalIndex === oldPortalIndex) {
      return this.content || defaultValue;
    }
    if(oldPortal !== null) {
      const {content} = this.swapContent({rerender: false});
      oldPortal.putBackContent(content, oldPortalIndex);
    }
     const content = this._receiveContent(portal, newPortalIndex);
    return content || Ember.String.htmlSafe(defaultValue);
  },
  /* jshint ignore:start */  /* waiting for destructuring defaults
     https://github.com/jshint/jshint/issues/2117
     to be released...*/
  swapContent({
      rerender = true, newContent = null, newPortal = null, 
      newPortalIndex = null} = {}) {
    let content = this.content;
    const portal = this.portal;
    const portalIndex = this.portalIndex;
    if (portalIndex == null) {
      content = content.childNodes;
    }
    if (newContent != null && newPortalIndex == null) {
      const wrapper = dom.createElement('DIV');
      Array.apply(null, newContent).forEach((node)=>wrapper.appendChild(node));
      newContent = wrapper;
    }
    this.content = newContent;
    this.portal = newPortal;
    this.portalIndex = newPortalIndex;
    if(rerender) {
      Ember.run.scheduleOnce('afterRender',this, 'recompute');
    }
    return {content, portal, portalIndex};
  },
  forgetContent({rerender = true} = {}) {
    this.content = null;
    this.portal = null;
    this.portalIndex = null;
    if(rerender) {
      Ember.run.scheduleOnce('afterRender',this, 'recompute');
    }
  },
  /* jshint ignore:end */
  willDestroyElement() {
    this.putBackContent();
  },
  _getPortals(declarations, name) {
    if (name != null) {
      const memo = declarations._memoFilters = declarations._memoFilters || {};
      let nameFilter = memo[name];
      if(nameFilter != null) {
        return nameFilter;
      }
      nameFilter = declarations.filter((decl)=>{
        const declName = decl.constructor.toString().split(':')[1];
        const classNames = decl.classNames || [];
        if (name !== declName && classNames.indexOf(name) === -1) {
          return false;
        }
        return true;
      });
      memo[name] = nameFilter;
      return nameFilter;
    } else {
      return declarations;
    }
  },
  _receiveContent(portal, portalIndex) {
    let content;
    this.portal = portal;
    this.portalIndex = portalIndex;
    if (portal == null) {
      this.content = undefined;
      return; 
    }
    if (portalIndex === null) {
      const elements = portal.portElements(this);
      content = document.createElement('DIV');
      Array.apply(null, elements).forEach((node)=>content.appendChild(node));
    }
    else { 
      content = portal.portElement(this, portalIndex || 0);
    }
    this.content = content;
    return content;
  }
});
