import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-preview-resize', 'Integration | Component | gallery preview resize', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-preview-resize}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-preview-resize}}
      template block text
    {{/gallery-preview-resize}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
