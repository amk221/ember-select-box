import invokeAction from '../component/invoke-action';
import { getAPI } from '../component/api';

export function open(selectBox) {
  if (selectBox.isDestroyed || selectBox.isOpen) {
    return;
  }

  selectBox.isOpen = true;

  opened(selectBox);
}

export function close(selectBox) {
  if (selectBox.isDestroyed || !selectBox.isOpen) {
    return;
  }

  selectBox.isOpen = false;

  closed(selectBox);
}

function opened(selectBox) {
  invokeAction(selectBox, 'onOpen', getAPI(selectBox));
}

function closed(selectBox) {
  invokeAction(selectBox, 'onClose', getAPI(selectBox));
}

export function toggle(selectBox) {
  if (selectBox.isOpen) {
    close(selectBox);
  } else {
    open(selectBox);
  }
}
