import Component from '@glimmer/component';
import { _activateOption } from '../../../utils/select-box/option/activate';
import {
  _destroyComponent,
  _insertComponent
} from '../../../utils/component/lifecycle';
import { _selectOption } from '../../../utils/select-box/option/select';
import { bool } from '@ember/object/computed';
import {
  deregisterElement,
  registerElement
} from '../../../utils/registration/element';
import { receiveValue } from '../../../utils/component/value';
import api from '../../../utils/select-box/option/api';
import isEqual from '../../../utils/general/is-equal';
import isSelected from '../../../utils/shared/is-selected';
import id from '../../../utils/shared/id';
import className from '../../../utils/select-box/option/class-name';
import { computed, action } from '@ember/object';

export default class SelectBoxOption extends Component {
  domElement = null;
  isFulfilled = false;
  isPending = true;
  isRejected = false;
  isSettled = false;
  memoisedAPI = null;
  previousResolvedValue = null;
  resolvedValue = null;
  valueID = 0;

  @api() api;
  @className() className;
  @id() id;
  @isEqual('index', 'selectBox.activeOptionIndex') isActive;
  @isSelected() isSelected;

  @computed('args.selectBox.options')
  get index() {
    return this.args.selectBox ? this.args.selectBox.options.indexOf(this) : -1;
  }

  get isDisabled() {
    return this.args.disabled;
  }

  constructor() {
    super(...arguments);
    receiveValue(this);
  }

  // Internal actions

  @action
  handleInsertElement(element) {
    registerElement(this, element);
    _insertComponent(this);
  }

  @action
  handleDestroyElement() {
    deregisterElement(this);
    _destroyComponent(this);
  }

  @action
  handleUpdateValue() {
    receiveValue(this);
  }

  @action
  handleMouseEnter() {
    _activateOption(this);
  }

  @action
  handleClick() {
    _selectOption(this);
  }
}
