
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('g-determine-image-popup-top-left', 'helper:g-determine-image-popup-top-left', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{g-determine-image-popup-top-left inputValue}}`);

  assert.equal(this.$().text().trim(), '1234');
});

