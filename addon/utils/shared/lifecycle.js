import invokeAction from '../shared/invoke-action';
import { getAPI } from '../shared/api';

export function initComponent(component) {
  invokeAction(component, 'onInit', getAPI(component));
}

export function _initComponent(component) {
  invokeAction(component, '_onInit', component);
}

export function destroyComponent(component) {
  invokeAction(component, 'onDestroy', getAPI(component));
}

export function _destroyComponent(component) {
  invokeAction(component, '_onDestroy', component);
}
