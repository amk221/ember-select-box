import Component from '@ember/component';
import {
  _destroyComponent,
  _initComponent
} from '../../utils/component/lifecycle';
import {
  deregisterElement,
  registerElement
} from '../../utils/registration/element';
import { receiveValue } from '../../utils/component/value';
import api from '../../utils/native-select-box/option/api';
import index from '../../utils/general/index';
import isSelected from '../../utils/shared/is-selected';
import layout from '../../templates/components/native-select-box/option';
import { className } from '../../utils/shared/attributes';
import { action } from '@ember/object';

export default class NativeSelectBoxOption extends Component {
  layout = layout;
  tagName = '';

  // Arguments

  classNamePrefix = '';
  selectBox = null;
  value = undefined;

  // State

  domElement = null;
  id = null;
  isFulfilled = false;
  isPending = true;
  isRejected = false;
  isSettled = false;
  memoisedAPI = null;
  previousResolvedValue = null;
  resolvedValue = null;

  // Computed state

  @api() api;
  @className() className;
  @index('selectBox.options') index;
  @isSelected() isSelected;

  init() {
    super.init(...arguments);
    _initComponent(this);
  }

  didReceiveAttrs() {
    super.didReceiveAttrs(...arguments);
    receiveValue(this);
  }

  // Internal actions

  @action
  handleInsertElement(element) {
    registerElement(this, element);
  }

  @action
  handleDestroyElement(element) {
    deregisterElement(this, element);
    _destroyComponent(this);
  }
}
