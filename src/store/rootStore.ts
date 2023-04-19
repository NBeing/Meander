import { Store, createStore, combineReducers } from 'redux';
import { defaultCanvasState, canvasReducer } from "./reducers/canvasReducer"
import { uiReducer, defaultUiState } from "./reducers/uiReducer";

const allReducers = combineReducers({
  motifOptions: canvasReducer,
  config: uiReducer,
});

export var store = createStore(
  allReducers,
  {
    motifOptions: defaultCanvasState,
    config: defaultUiState
  },
  (window as any).devToolsExtension && (window as any).devToolsExtension()
);
