import Component from '@ember/component';
import { _selectOption, selectOption } from '../utils/select-box/option/select';
import {
  activateOptionForValue,
  activateOption,
  activateOptionAtIndex,
  activateOptionForKeyCode
} from '../utils/select-box/option/activate';
import {
  activateSelectedOption,
  activateSelectedOptionAtIndex,
  activateSelectedOptionForKeyCode
} from '../utils/select-box/selected-option/activate';
import { blurInput, focusInput } from '../utils/select-box/input/focus';
import { bool, or } from '@ember/object/computed';
import { cancelSearch, maybeSearch, search } from '../utils/select-box/search';
import { close, open, toggle } from '../utils/select-box/toggle';
import { deactivateOptions } from '../utils/select-box/option/deactivate';
import { deactivateSelectedOptions } from '../utils/select-box/selected-option/deactivate';
import {
  deregisterElement,
  registerElement
} from '../utils/registration/element';
import { deregisterInput, registerInput } from '../utils/registration/input';
import {
  deregisterOption,
  initOptions,
  registerOption
} from '../utils/registration/option';
import {
  deregisterOptionsContainer,
  registerOptionsContainer
} from '../utils/registration/options';
import {
  deregisterSelectedOption,
  initSelectedOptions,
  registerSelectedOption
} from '../utils/registration/selected-option';
import {
  deregisterSelectedOptionsContainer,
  registerSelectedOptionsContainer
} from '../utils/registration/selected-options';
import {
  addDocumentClickListener,
  removeDocumentClickListener
} from '../utils/select-box/document';
import { focusIn, focusOut } from '../utils/select-box/focus';
import { keyDown, keyPress } from '../utils/select-box/keyboard';
import { receiveArgs } from '../utils/select-box/args';
import { setInputValue } from '../utils/select-box/input/value';
import api from '../utils/select-box/api';
import layout from '../templates/components/select-box';
import objectAtIndex from '../utils/general/object-at-index';
import { receiveValue, selectValue, updateValue } from '../utils/shared/value';
import { id, className } from '../utils/shared/attributes';
import { ready } from '../utils/shared/ready';
import { insertElement } from '../utils/shared/element';

export default Component.extend({
  layout,
  tagName: '',

  // Arguments

  classNamePrefix: '',
  disabled: false,
  multiple: false,
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
  onReady: null,
  onSearch: null,
  onSearched: null,
  onSearchError: null,
  onSelect: null,
  onUpdate: null,

  // State

  activeOptionIndex: -1,
  activeSelectedOptionIndex: -1,
  documentClickHandler: null,
  domElement: null,
  isFocused: false,
  isFulfilled: false,
  isOpen: false,
  isPending: true,
  isRejected: false,
  isSearching: false,
  isSettled: false,
  isSlowSearch: false,
  memoisedAPI: null,
  optionCharState: null,
  previousResolvedValue: null,
  resolvedValue: null,
  searchID: 0,
  tabIndex: '0',
  valueID: 0,

  // Child components

  input: null,
  options: null,
  optionsContainer: null,
  selectedOptions: null,
  selectedOptionsContainer: null,

  // Computed state

  className: className(),
  id: id(),
  isDisabled: bool('disabled'),
  isBusy: or('isPending', 'isSearching'),
  isMultiple: bool('multiple'),
  api: api(),
  activeOption: objectAtIndex('options', 'activeOptionIndex'),
  activeSelectedOption: objectAtIndex(
    'selectedOptions',
    'activeSelectedOptionIndex'
  ),

  init() {
    this._super(...arguments);
    initOptions(this);
    initSelectedOptions(this);
    ready(this);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    receiveArgs(this);
    receiveValue(this);
  },

  actions: {
    // Internal actions

    handleInsertElement(element) {
      registerElement(this, element);
      addDocumentClickListener(this);
      insertElement(this);
    },

    handleDestroyElement(element) {
      deregisterElement(this, element);
      removeDocumentClickListener(this);
    },

    handleInitOption(option) {
      registerOption(this, option);
    },

    handleDestroyOption(option) {
      deregisterOption(this, option);
    },

    handleInitSelectedOption(option) {
      registerSelectedOption(this, option);
    },

    handleDestroySelectedOption(option) {
      deregisterSelectedOption(this, option);
    },

    handleInitOptionsContainer(optionsContainer) {
      registerOptionsContainer(this, optionsContainer);
    },

    handleDestroyOptionsContainer(optionsContainer) {
      deregisterOptionsContainer(this, optionsContainer);
    },

    handleInitSelectedOptionsContainer(selectedOptionsContainer) {
      registerSelectedOptionsContainer(this, selectedOptionsContainer);
    },

    handleDestroySelectedOptionsContainer(selectedOptionsContainer) {
      deregisterSelectedOptionsContainer(this, selectedOptionsContainer);
    },

    handleInitInput(input) {
      registerInput(this, input);
    },

    handleDestroyInput(input) {
      deregisterInput(this, input);
    },

    handleInputText(text) {
      maybeSearch(this, text);
    },

    handleFocusIn(e) {
      focusIn(this, e);
    },

    handleFocusOut(e) {
      focusOut(this, e);
    },

    handleKeyPress(e) {
      keyPress(this, e);
    },

    handleKeyDown(e) {
      keyDown(this, e);
    },

    handlePressEnter() {
      _selectOption(this.activeOption);
    },

    handleSelectOption(option) {
      return selectOption(this, option);
    },

    handleActivateOption(option) {
      activateOption(this, option);
    },

    handleActivateSelectedOption(selectedOption) {
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

    activateOptionForValue(value, config) {
      activateOptionForValue(this, value, config);
    },

    activateOptionAtIndex(index, config) {
      activateOptionAtIndex(this, index, config);
    },

    activateNextOption(config) {
      activateOptionAtIndex(this, this.activeOptionIndex + 1, config);
    },

    activatePreviousOption(config) {
      activateOptionAtIndex(this, this.activeOptionIndex - 1, config);
    },

    activateOptionForKeyCode(keyCode, config) {
      activateOptionForKeyCode(this, keyCode, config);
    },

    activateSelectedOptionAtIndex(index, config) {
      activateSelectedOptionAtIndex(this, index, config);
    },

    activateNextSelectedOption(config) {
      activateSelectedOptionAtIndex(
        this,
        this.activeSelectedOptionIndex + 1,
        config
      );
    },

    activatePreviousSelectedOption(config) {
      activateSelectedOptionAtIndex(
        this,
        this.activeSelectedOptionIndex - 1,
        config
      );
    },

    activateSelectedOptionForKeyCode(keyCode, config) {
      activateSelectedOptionForKeyCode(this, keyCode, config);
    },

    deactivateOptions() {
      deactivateOptions(this);
    },

    deactivateSelectedOptions() {
      deactivateSelectedOptions(this);
    }
  }
});
