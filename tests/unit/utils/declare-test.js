/**
  @module tests/unit/utils/declare-test
*/
import Ember from 'ember';
import { declarationFor } from 'ember-declarative/utils/declare';
import { module, test } from 'qunit';

const Foo = Ember.Object.extend({});
const Bar = Ember.Object.extend({});

const DContainer = Ember.Object.extend({
  declarations: Ember.computed(()=>Ember.A()),
  fooDecl: declarationFor(Foo)
});

module('Unit | Utility | declare');

test('declarationFor finds first declaration which is instance of argument.', 
    function(assert) {

  const container = DContainer.create();
  const foo1 = Foo.create();
  const foo2 = Foo.create();
  container.get('declarations').addObjects([foo1, foo2]);
  const fooDecl = container.get('fooDecl');
  assert.equal(foo1, fooDecl);
});


test('declarationFor returns undefined if no Foo in declarations.', 
    function(assert) {

  const container = DContainer.create();
  const bar = Bar.create();
  container.get('declarations').addObject(bar);
  const fooDecl = container.get('fooDecl');
  assert.notOk(fooDecl);
});
