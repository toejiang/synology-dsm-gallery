
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-album-image-src', 'helper:g-album-image-src', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{g-album-image-src inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

