import Component from '@ember/component';
import layout from '../templates/components/select-box';
import { bool, or } from '@ember/object/computed';
import { get, set } from '@ember/object';
import escapeRegExp from '../utils/general/escape-regexp';
import collapseWhitespace from '../utils/general/collapse-whitespace';
import { destroyElement, insertElement } from '../utils/select-box/element';
import {
  deregisterOptionsContainer,
  registerOptionsContainer
} from '../utils/registration/options';
import { receiveArgs } from '../utils/select-box/args';
import {
  deregisterSelectedOptionsContainer,
  registerSelectedOptionsContainer
} from '../utils/registration/selected-options';
import {
  activateOption,
  activateOptionAtIndex,
  activateOptionForKeyCode
} from '../utils/select-box/option/activate';
import {
  activateSelectedOption,
  activateSelectedOptionAtIndex,
  activateSelectedOptionForKeyCode
} from '../utils/select-box/selected-option/activate';
import { deactivateOptions } from '../utils/select-box/option/deactivate';
import { deactivateSelectedOptions } from '../utils/select-box/selected-option/deactivate';
import {
  deregisterOption,
  initOptions,
  registerOption
} from '../utils/registration/option';
import {
  deregisterSelectedOption,
  initSelectedOptions,
  registerSelectedOption
} from '../utils/registration/selected-option';
import {
  deregisterElement,
  registerElement
} from '../utils/registration/element';
import { deregisterInput, registerInput } from '../utils/registration/input';
import { destroyComponent, initComponent } from '../utils/component/lifecycle';
import api from '../utils/select-box/api';
import { _selectOption, selectOption } from '../utils/select-box/option/select';
import { receiveValue, selectValue, updateValue } from '../utils/shared/value';
import { close, open, toggle } from '../utils/select-box/toggle';
import { focusIn, focusOut } from '../utils/select-box/focus';
import { cancelSearch, maybeSearch, search } from '../utils/select-box/search';
import { blurInput, focusInput } from '../utils/select-box/input/focus';
import { keyDown, keyPress } from '../utils/select-box/keyboard';
import { setInputValue } from '../utils/select-box/input/value';
import objectAtIndex from '../utils/general/object-at-index';
const { fromCharCode } = String;
export const COLLECT_CHARS_MS = 1000;

export default Component.extend({
  layout,
  tagName: '',

  // Arguments

  classNamePrefix: '',
  disabled: false,
  multiple: false,
  open: false,
  searchDelayTime: 100,
  searchMinChars: 1,
  searchSlowTime: 500,
  value: undefined,

  // Actions

  onBuildSelection: null,
  onClickOutside: null,
  onClose: null,
  onFocusIn: null,
  onFocusOut: null,
  onInit: null,
  onInsertElement: null,
  onOpen: null,
  onPressBackspace: null,
  onPressDown: null,
  onPressEnter: null,
  onPressEscape: null,
  onPressKey: null,
  onPressLeft: null,
  onPressRight: null,
  onPressTab: null,
  onPressUp: null,
  onSearch: null,
  onSearched: null,
  onSearchError: null,
  onSelect: null,
  onUpdate: null,

  // State

  resolvedValue: null,
  previousResolvedValue: null,
  activeOptionIndex: -1,
  activeSelectedOptionIndex: -1,
  documentClickHandler: null,
  domElement: null,
  id: null,
  isFocused: false,
  isSlowSearch: false,
  isOpen: false,
  isFulfilled: false,
  isPending: true,
  isRejected: false,
  isSearching: false,
  isSettled: false,
  tabIndex: '0',
  valueID: 0,
  searchID: 0,
  memoisedAPI: null,

  // Child components

  input: null,
  options: null,
  optionsContainer: null,
  selectedOptions: null,
  selectedOptionsContainer: null,

  // Computed state

  api: api(),
  isMultiple: bool('multiple'),
  isDisabled: bool('disabled'),
  isBusy: or('isPending', 'isSearching'),
  activeOption: objectAtIndex('options', 'activeOptionIndex'),
  activeSelectedOption: objectAtIndex(
    'selectedOptions',
    'activeSelectedOptionIndex'
  ),

  // Actions

  init() {
    this._super(...arguments);
    initOptions(this);
    initSelectedOptions(this);
    initComponent(this);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    receiveArgs(this);
    receiveValue(this);
  },

  actions: {
    // Internal actions

    didInsertElement(element) {
      registerElement(this, element);
      insertElement(this);
    },

    willDestroyElement(element) {
      deregisterElement(this, element);
      destroyElement(this);
      destroyComponent(this);
    },

    onInitOption(option) {
      registerOption(this, option);
    },

    onDestroyOption(option) {
      deregisterOption(this, option);
    },

    onInitSelectedOption(option) {
      registerSelectedOption(this, option);
    },

    onDestroySelectedOption(option) {
      deregisterSelectedOption(this, option);
    },

    onInitOptionsContainer(optionsContainer) {
      registerOptionsContainer(this, optionsContainer);
    },

    onDestroyOptionsContainer(optionsContainer) {
      deregisterOptionsContainer(this, optionsContainer);
    },

    onInitSelectedOptionsContainer(selectedOptionsContainer) {
      registerSelectedOptionsContainer(this, selectedOptionsContainer);
    },

    onDestroySelectedOptionsContainer(selectedOptionsContainer) {
      deregisterSelectedOptionsContainer(this, selectedOptionsContainer);
    },

    onInitInput(input) {
      registerInput(this, input);
    },

    onDestroyInput(input) {
      deregisterInput(this, input);
    },

    onInputText(text) {
      maybeSearch(this, text);
    },

    onFocusIn(e) {
      focusIn(this, e);
    },

    onFocusOut(e) {
      focusOut(this, e);
    },

    onKeyPress(e) {
      keyPress(this, e);
    },

    onKeyDown(e) {
      keyDown(this, e);
    },

    onPressEnter() {
      _selectOption(this.activeOption);
    },

    onSelectOption(option) {
      return selectOption(this, option);
    },

    onActivateOption(option) {
      activateOption(this, option);
    },

    onActivateSelectedOption(selectedOption) {
      activateSelectedOption(this, selectedOption);
    },

    // Public API Actions

    select(value) {
      return selectValue(this, value);
    },

    update(value) {
      return updateValue(this, value);
    },

    selectActiveOption() {
      return _selectOption(this.activeOption);
    },

    open() {
      open(this);
    },

    close() {
      close(this);
    },

    toggle() {
      toggle(this);
    },

    search(query) {
      return search(this, query);
    },

    cancelSearch() {
      cancelSearch(this);
    },

    focusInput() {
      focusInput(this);
    },

    blurInput() {
      blurInput(this);
    },

    setInputValue(value) {
      setInputValue(this, value);
    },

    activateOptionAtIndex(index, scroll = false) {
      activateOptionAtIndex(this, index, scroll);
    },

    activateNextOption(scroll = true) {
      activateOptionAtIndex(this, this.activeOptionIndex + 1, scroll);
    },

    activatePreviousOption(scroll = true) {
      activateOptionAtIndex(this, this.activeOptionIndex - 1, scroll);
    },

    activateOptionForKeyCode(keyCode) {
      activateOptionForKeyCode(this, keyCode, scroll);
    },

    activateSelectedOptionAtIndex(index, scroll = false) {
      activateSelectedOptionAtIndex(this, index, scroll);
    },

    activateNextSelectedOption(scroll = true) {
      activateSelectedOptionAtIndex(
        this,
        this.activeSelectedOptionIndex + 1,
        scroll
      );
    },

    activatePreviousSelectedOption(scroll = true) {
      activateSelectedOptionAtIndex(
        this,
        this.activeSelectedOptionIndex - 1,
        scroll
      );
    },

    activateSelectedOptionForKeyCode(keyCode) {
      activateOptionForKeyCode(this, keyCode, scroll);
    },

    deactivateOptions() {
      deactivateOptions(this);
    },

    deactivateSelectedOptions() {
      deactivateSelectedOptions(this);
    }
  }
});
