import afterRender from '../general/after-render';
import invokeAction from '../component/invoke-action';
import { initComponent } from '../component/lifecycle';
import { resolveValue } from '../component/value';
import { get, set } from '@ember/object';
import { getAPI } from '../component/api';
import { makeArray } from '@ember/array';
const { freeze } = Object;

export function receiveValue(selectBox) {
  updateValue(selectBox, selectBox.value).then(() => {
    if (!selectBox.initialised) {
      initComponent(selectBox);
      set(selectBox, 'isInitialised', true);
    }
  });
}

export function updateValue(selectBox, unresolvedValue) {
  return resolveValue(selectBox, unresolvedValue, processValue)
    .then(afterRender)
    .then(() => updatedValue(selectBox));
}

function processValue(selectBox, value) {
  if (get(selectBox, 'isMultiple')) {
    return freeze(makeArray(value).slice());
  }

  return value;
}

export function updatedValue(selectBox) {
  if (
    selectBox.isDestroyed ||
    selectBox.isDestroying ||
    selectBox.resolvedValue === selectBox.previousResolvedValue
  ) {
    return;
  }

  invokeAction(
    selectBox,
    'onUpdate',
    selectBox.resolvedValue,
    getAPI(selectBox)
  );
}

export function selectedValue(selectBox) {
  invokeAction(
    selectBox,
    'onSelect',
    selectBox.resolvedValue,
    getAPI(selectBox)
  );
}
