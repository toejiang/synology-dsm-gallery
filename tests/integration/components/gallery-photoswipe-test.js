import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-photoswipe', 'Integration | Component | gallery photoswipe', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-photoswipe}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-photoswipe}}
      template block text
    {{/gallery-photoswipe}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
