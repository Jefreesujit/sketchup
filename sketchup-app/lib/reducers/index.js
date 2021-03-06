import * as actionEvents from '../actions/index';

export function homePageReducer (state, action) {
  let actionType = action.type,
      newState = Object.assign({}, state);

  if (actionType === actionEvents.SET_PAGEDATA) {
    newState = action.payload;
  }

  return newState;
}

export function viewPageReducer (state, action) {
  let actionType = action.type,
      newState = Object.assign({}, state);

  if (actionType === actionEvents.SET_SKETCHDATA) {
    newState = action.payload;
  }

  return newState;
}

export function appState (state, action) {
  let actionType = action.type,
      newState = Object.assign({}, state);

  if (actionType === actionEvents.LOCATION_CHANGE) {
    newState.current.path = action.payload.pathname;
  }

  return newState;
}

export function dataRequests (state, action) {
  let actionType = action.type,
      newState = Object.assign({}, state);

  if (actionType === actionEvents.SETTING_PAGEDATA) {
    newState.loading = true;
  } else if (actionType === actionEvents.SET_PAGEDATA) {
    newState.loading = false;
  } else if (actionType === actionEvents.SAVING_IMAGE) {
    newState.loading = true;
  } else if (actionType === actionEvents.SAVE_IMAGE) {
    newState.loading = false;
  }

  return newState;
}
