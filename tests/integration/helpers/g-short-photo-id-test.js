
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-short-photo-id', 'helper:g-short-photo-id', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{g-short-photo-id inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

