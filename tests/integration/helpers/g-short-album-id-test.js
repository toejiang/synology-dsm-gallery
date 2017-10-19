
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-short-album-id', 'helper:g-short-album-id', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{g-short-album-id inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

