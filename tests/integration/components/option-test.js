import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('', 'select-box/option', {
  integration: true
});


test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs `{{select-box/option}}`);

  assert.equal(this.$('div.select-box-option').length, 1,
    'renders with correct class name and tag');
});


test('class prefix', function(assert) {
  assert.expect(1);

  this.render(hbs `{{select-box/option class-prefix='foo'}}`);

  assert.equal(this.$('.foo-option').length, 1,
    'can override the class prefix');
});


test('aria', function(assert) {
  assert.expect(1);

  this.render(hbs `{{select-box/option}}`);

  assert.equal(this.$('.select-box-option').attr('role'), 'option',
    'a select box option has an appropriate aria role');
});


test('title', function(assert) {
  assert.expect(1);

  this.render(hbs `{{select-box/option title='Foo'}}`);

  assert.equal(this.$('.select-box-option').attr('title'), 'Foo',
    'a select box option can have a title attribute');
});


test('style', function(assert) {
  assert.expect(1);

  this.render(hbs `{{select-box/option style='color:red<script>'}}`);

  assert.ok(this.$().html().match('style="color:red&amp;lt;script&amp;gt;"'),
    'an option can be styled, value is escaped');
});


test('yield', function(assert) {
  assert.expect(1);

  this.set('group1', [
    { myValue: 'foo', myLabel: 'Foo' },
    { myValue: 'bar', myLabel: 'Bar' }
  ]);

  this.set('group2', [
    { myValue: 'baz', myLabel: 'Baz' },
    { myValue: 'qux', myLabel: 'Qux' }
  ]);

  this.render(hbs`
    {{#select-box as |sb|}}
      {{#sb.group label='Group 1'}}
        {{#each group1 as |item i|}}
          {{#sb.option value=item.myValue label=item.myLabel as |o|~}}
            {{o.label}}={{o.value}} {{i}} ({{o.index}})
          {{~/sb.option}}
        {{/each}}
      {{/sb.group}}
      {{#sb.group label='Group 2'}}
        {{#each group2 as |item i|}}
          {{#sb.option value=item.myValue label=item.myLabel as |o|~}}
            {{o.label}}={{o.value}} {{i}} ({{o.index}})
          {{~/sb.option}}
        {{/each}}
      {{/sb.group}}
    {{/select-box}}
  `);

  assert.ok(
    this.$('.select-box-option:eq(0)').text() === 'Foo=foo 0 (0)' &&
    this.$('.select-box-option:eq(1)').text() === 'Bar=bar 1 (1)' &&
    this.$('.select-box-option:eq(2)').text() === 'Baz=baz 0 (2)' &&
    this.$('.select-box-option:eq(3)').text() === 'Qux=qux 1 (3)',
    'select box options can yield their label, value & index'
  );
});
