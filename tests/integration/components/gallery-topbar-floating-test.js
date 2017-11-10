import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-topbar-floating', 'Integration | Component | gallery topbar floating', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-topbar-floating}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-topbar-floating}}
      template block text
    {{/gallery-topbar-floating}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
