import {
  UPDATE_MOTIF, 
  UPDATE_CONFIG,
  UPDATE_ALL_CONFIG,
  UPDATE_ALL_MOTIFS
} from "../actions/canvasActions"
import { MotifDefinition, MotifModOptions, MotifOptionsReducerState } from "../../types"

// Default Motif Config
const motif:MotifDefinition = [
  0, 
  Math.PI/2, 
  -Math.PI/4, 
  0, 
  0, 
  -Math.PI/3, 
  -Math.PI/2, 
  0
]
// Default options
const config:MotifModOptions = 
 [{ optionName: 'depth'       , min: -400 , max:2000  , value: 1       , type: 'range'    },
  { optionName: 'sides'       , min: 2 ,    max:25    , value: 7       , type: 'range'    },
  { optionName: 'lineWidth'   , min: 0 ,    max:400   , value: 10      , type: 'range'    },
  { optionName: 'sideLength'  , min: 2 ,    max:1200  , value: 300     , type: 'range'    },
  { optionName: 'baseRotation', min: 0 ,    max:90    , value: 0       , type: 'range'    },
  { optionName: 'numSegments' , min: 2 ,    max:20000 , value: 30      , type: 'range'    },
  { optionName: 'drawEvery'   , min: 1 ,    max:100   , value: 1       , type: 'range'    },
  { optionName: 'flip'        , min: 0 ,    max:1     , checked: false , type: 'checkbox' },
  { optionName: 'animate'     , min: 1 ,    max:9     , checked: true  , type: 'checkbox' },
  { optionName: 'fitToSide'   , min: 0 ,    max:1     , checked: false , type: 'checkbox' },
  { optionName: 'clearScreen' , min: 0 ,    max:1     , checked: false , type: 'checkbox' },
  { optionName: 'red'         , min: 0 ,    max:255   , value: 127     , type: 'range'    },
  { optionName: 'green'       , min: 0 ,    max:255   , value: 10      , type: 'range'    },
  { optionName: 'blue'        , min: 0 ,    max:255   , value: 50      , type: 'range'    },
]

export const defaultCanvasState:MotifOptionsReducerState = { motifAngles:motif, motifModOptions:config }

const updateOptionInMeanderConfig =
  ( state, payload ) => {
    return state.motifModOptions.map( configOption => {
      // If its the changed option
      if( configOption.optionName === payload.option.optionName ) {
        // Get value from slider or checkbox
        if(payload.option.type === 'range'){
          configOption.value = parseInt(payload.value)
        }
        configOption.checked = payload.checked
      }
      return configOption
    })
  }
const updateAllConfig = 
  (state, payload ) => {
    //console.log("Got state payload", state, payload);
    return payload.config
  }

export const canvasReducer = (state = defaultCanvasState, action) => {
  switch (action.type) {

    case UPDATE_MOTIF:
      let {index, value} = action.payload;
    
      let motifAngles = state.motifAngles.map(( y , i ) => (index === i) ? parseFloat(value) : y)
      return { ...state, ...{motifAngles}}

    case UPDATE_ALL_MOTIFS:
      return { ...state, ...{ motifAngles: action.payload}}
  
    case UPDATE_CONFIG:
      // console.log("Action", action,"New config ", { ...state, ...{motifModOptions: updateOptionInMeanderConfig( state, action.payload)}})
      return { ...state, ...{motifModOptions: updateOptionInMeanderConfig( state, action.payload)}}

    case UPDATE_ALL_CONFIG:
      // console.log("Update all config",  state, action)
      return { ...state, ...{ motifModOptions: updateAllConfig(state, action.payload.motifModOptions)}}
    default:
      return state;
  }
}
