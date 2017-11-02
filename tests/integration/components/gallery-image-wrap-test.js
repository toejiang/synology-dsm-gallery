import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-image-wrap', 'Integration | Component | gallery image wrap', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-image-wrap}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-image-wrap}}
      template block text
    {{/gallery-image-wrap}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
