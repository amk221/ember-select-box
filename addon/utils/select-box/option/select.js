import invokeAction from '../../component/invoke-action';
import { selectValue } from '../value';
import { getAPI } from '../../component/api';

export function _selectOption(option) {
  if (option.isDisabled) {
    return;
  }

  return invokeAction(option, '_onSelect', option);
}

export function selectOption(selectBox, option) {
  selectedOption(option);

  return selectValue(selectBox, option.value);
}

export function selectedOption(option) {
  invokeAction(option, 'onSelect', option.value, getAPI(option));
}
