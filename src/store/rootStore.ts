import { Store, createStore, combineReducers } from 'redux';
import { defaultCanvasState, canvasReducer } from "./reducers/canvasReducer"

const allReducers = combineReducers({
  canvas: canvasReducer
});

export var store = createStore(
  allReducers,
  {
    canvas: defaultCanvasState,
  },
  (window as any).devToolsExtension && (window as any).devToolsExtension()
  );
