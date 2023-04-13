import { UPDATE_UI } from "../actions/uiActions"

// Default options
const uiConfig = { showOptions: true }

export const defaultUiState = { ...uiConfig }

export const uiReducer = (state = defaultUiState, action) => {
  switch (action.type) {

    case UPDATE_UI:
      console.log("Update UI", action, state, 
        { ...state, ...{showOptions: action.payload.showOptions }}
      );
      return { ...state, ...{showOptions: action.payload.showOptions}}
    default:
      return state;
  }
}
