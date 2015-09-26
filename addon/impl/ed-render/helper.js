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
 * **TODO** content is "teleported" from the hidden declarations
 * section. In the future, the IDs of teleported content should be
 * modified, and the content copied, rather than moved.
 *
 */

import Ember from 'ember';


export default Ember.Helper.extend({

  portal: null,

  compute(params, hash) {
    let [declarations, name, itemIndex, itemSubIndex] = params;
    if (typeof name == 'number') {
      itemSubIndex = itemIndex;
      itemIndex = name;
      name = null;
    }
    let portal = this.get('portal');
    let declIndex = 0;
    let content = null;
    declarations.some((decl)=>{
      if (name != null) {
        const declName = decl.constructor.toString().split(':')[1];
        const classNames = decl.classNames || [];
        if (name !== declName && classNames.indexOf(name) === -1) {
          return false;
        }
      }
      if (itemIndex !== declIndex++) { return false; }
      if (portal != decl) {
        if (portal != null) {
          portal.off('didRender', this, 'recompute');
        }
        Ember.run.scheduleOnce('afterRender', ()=>{
          this.set('portal', decl);
          decl.on('didRender', this, 'recompute');
        });
      }
      if (itemSubIndex === null) {
        content = decl.portElements();
        return true;
      }
      else { 
        content = decl.portElement(itemSubIndex || 0);
        return true;
      }
    });
    return content;
  },
  willDestroyElement() {
    const portal = this.get('portal');
    if (portal != null) {
      portal.off('didRender', this, 'recompute');
    }
  }
});
