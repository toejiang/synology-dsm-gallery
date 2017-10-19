
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-album-image-shortid', 'helper:g-album-image-shortid', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{g-album-image-shortid inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

