import Ember from 'ember';
import { helper } from 'ember-helper';
import { htmlSafe } from 'ember-string';
import className from '../utils/select-box/class-name';
const { escapeExpression } = Ember.Handlebars.Utils;


export default helper(function() {
  let string = className(...arguments);
  string = escapeExpression(string);
  return htmlSafe(string);
});
