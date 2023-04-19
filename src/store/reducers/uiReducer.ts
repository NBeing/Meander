import { UPDATE_UI } from "../actions/uiActions"
import { UIConfig } from "../../types"

// Default options
export const defaultUiState:UIConfig = { showOptions: true }

export const uiReducer = (state = defaultUiState, action) => {
  switch (action.type) {

    case UPDATE_UI:
      return { ...state, ...{showOptions: action.payload.showOptions}}
    default:
      return state;
  }
}
