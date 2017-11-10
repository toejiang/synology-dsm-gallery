import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('gallery-topbar', 'Integration | Component | gallery topbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{gallery-topbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#gallery-topbar}}
      template block text
    {{/gallery-topbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
