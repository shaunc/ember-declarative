/**
 * @module ember-declarative/impl/ed-render/helper
 *
 * Helper to render content from declarations into implementation.
 *
 * Arguments: `declarations name itemIndex itemSubindex`, where:
 *
 * * name -- class name to filter declarations by; optional (skipped
 *   if first argument a number). If specified should either be
 *   dasherized name of declarative component (e.g. `merge-list`),
 *   or a css class.
 * * itemIndex -- which of the declarations of class to reference
 * * itemSubIndex -- to pass to portal interface to get rendered content
 *   Optional; default 0. pass as `null` to get all elements.
 *
 * Cooperates with `ember-declarative/decl/ed-portal` to maintain
 * correspondence between content as declared and content implementation.
 */

import Ember from 'ember';

function _E(content) {
  const text = (content || {}).innerText;
  return ('' + text).trim();
}


export default Ember.Helper.extend({

  init() {
    this._super();
    this.portal = null;
    this.portalIndex = null;
    this.content = null;
  },

  compute(params) {
    let [declarations, name, itemIndex, newPortalIndex] = params;
    if (typeof name === 'number') {
      newPortalIndex = itemIndex;
      itemIndex = name;
      name = null;
    }
    const portals = this._getPortals(declarations, name);
    let newPortal = portals[itemIndex];
    let oldPortal = this.portal;
    let oldPortalIndex = this.portalIndex;
    if(newPortal === oldPortal && newPortalIndex === oldPortalIndex) {
      console.log("replaced content?", Ember.guidFor(this), _E(this.content));
      return this.content;
    }
    if(oldPortal !== null) {
      const {content} = this.swapContent({rerender: false});
      oldPortal.putBackContent(content, oldPortalIndex);
    }
    const content = this._receiveContent(newPortal, newPortalIndex);
    //console.log("new content", Ember.guidFor(this), _E(this.content));
    return content;
  },
  /* jshint ignore:start */  /* waiting for destructuring defaults
     https://github.com/jshint/jshint/issues/2117
     to be released...*/
  swapContent({
      rerender = true, newContent = null, newPortal = null, 
      newPortalIndex = null} = {}) {
    const content = this.content;
    const portal = this.portal;
    const portalIndex = this.portalIndex;
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
    if (portalIndex === null) {
      content = portal.portElements(this);
    }
    else { 
      content = portal.portElement(this, portalIndex || 0);
    }
    this.content = content;
    return content;
  }
});
