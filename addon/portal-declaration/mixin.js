// ember-declarative/portal-declaration/mixin

import Ember from 'ember';
import DeclarationBase from '../declaration-base/mixin';

export default Ember.Mixin.create(DeclarationBase, {
  /**
   * Property via which content is sent. (Typically,
   * an alias to a property on `declarationContainer`.)
   * 
   * Will set the `portalAttribute` attribute to "self".
   *
   * @property portalContainer
   * @type Object
   */
  portalContainer: null,
  /**
   * Attribute of `portalContainer` to send self with.
   *
   * @property portalAttribute
   * @type String
   */
  portalAttribute: null,
  /**
   * CSS class to use to filter own subnodes when porting content.
   *
   * @property portalElementClass
   * @type String
   */
  portalElementClass: null,
  /**
   *
   * Since `declarationContainer` is set dynamically by `DeclarationBase`,
   * it seems that observer on `portalContainer` is not sufficient to
   * insure update. Set this property to declare an explicit dynamic
   * observer on `declarationContainer`.
   *
   * TODO: can we avoid this?
   *
   * @property watchAttribute
   * @type String
   */
  watchAttribute: null,
  /**
   * Own attribute to mark as having changed whenever `watchAttribute`
   * changes. 
   *
   * @property notifyAttribute
   * @type String
   */
  notifyAttribute: null,

  didReceiveAttrs() {
    this._super();
    this.savePortal();
    let watchAttribute = this.get('watchAttribute');
    if (watchAttribute != null) {
      let container = this.get('declarationContainer');
      container.addObserver(
        watchAttribute, this, 'updateDeclaration');
    }
  },
  willDestroyElement() {
    let watchAttribute = this.get('watchAttribute');
    if (watchAttribute != null) {
      let container = this.get('declarationContainer');
      container.removeObserver(
        watchAttribute, this, 'updateDeclaration');
    }
  },
  updateDeclaration() {
    this.savePortal();
    let notify = this.get('notifyAttribute');
    if (notify != null) {
      this.notifyPropertyChange(notify);
    }
  },
  savePortal() {
    let portal = this.get('portalContainer');
    if (portal == null) { return; }
    let portalAttribute = this.get('portalAttribute');
    Ember.set(portal, portalAttribute, this);
  },
  portElements() {
    let elt = this.element;
    if (elt == null) { return; }
    let subClass = this.get('portalElementClass');
    if (subClass == null) {
      return elt.childNodes;
    }
    let subElements = elt.getElementsByClassName(subClass);
    return subElements;
  }
});