import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('/dummy/merge-lists', 'Integration | Component | dummy/merge lists', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  this.set('vegetable', ['apple', 'lettuce', 'pear']);
  this.set('animal', ['bear', 'goat', 'zebra']);

  // Template block usage:
  this.render(hbs`
    {{#merge-lists}}

      {{#merge-list data=vegetable as |item|}}
        <li style="color:green">{{item}}</li>
      {{/merge-list}}

      {{#merge-list data=animal as |item|}}
        <li style="color:red">{{item}}</li>
      {{/merge-list}}

    {{/merge-lists}}    
  `);
  let   actual = this.$('ul').text().trim().split(/\s+/);
  assert.deepEqual(
    actual, ["apple", "bear", "goat", "lettuce", "pear", "zebra"],
    'lists are merged in sorted order');
});
