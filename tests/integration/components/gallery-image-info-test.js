import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-image-info', 'Integration | Component | gallery image info', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-image-info}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-image-info}}
      template block text
    {{/gallery-image-info}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
