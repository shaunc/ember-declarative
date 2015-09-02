import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('/dummy/merge-lists', 'Integration | Component | dummy/merge lists', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(1);

  let data = {
    vegetable: ['apple', 'lettuce', 'pear'],
    animal: ['bear', 'goat', 'zebra']
  };
  this.set('data', data);

  // Template block usage:
  this.render(hbs`
    {{#merge-lists data=data }}

      {{#merge-item list='vegetable' as |item|}}
        <li style="color:green">{{item}}</li>
      {{/merge-item}}

      {{#merge-item list='animal' as |item|}}
        <li style="color:red">{{item}}</li>
      {{/merge-item}}

    {{/merge-lists}}    
  `);
  let   actual = this.$('ul').text().trim().split(/\s+/);
  assert.deepEqual(
    actual, ["apple", "bear", "goat", "lettuce", "pear", "zebra"],
    'lists are merged in sorted order');
});
