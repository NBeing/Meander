import { UPDATE_MOTIF, 
        UPDATE_CONFIG,
        UPDATE_ALL_CONFIG } from "../actions/canvasActions"

// Default Motif Config
const motif = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0]

// Default options
const config = 
 [{ optionName: 'depth'       , min: 0 , max:7     , value: 3     , type: 'range'    },
  { optionName: 'sides'       , min: 2 , max:25    , value: 7     , type: 'range'    },
  { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10    , type: 'range'    },
  { optionName: 'sideLength'  , min: 2 , max:1200  , value: 300   , type: 'range'    },
  { optionName: 'baseRotation', min: 0 , max:0     , value: 0     , type: 'range'    },
  { optionName: 'numSegments' , min: 2 , max:20000 , value: 300   , type: 'range'    },
  { optionName: 'flip'        , min: 0 , max:1     , value: false , type: 'checkbox' },
  { optionName: 'noAnimation' , min: 1 , max:9     , value: false , type: 'checkbox' },
  { optionName: 'fitToSide'   , min: 0 , max:1     , value: false , type: 'checkbox' }]

export const defaultCanvasState = { motif, config }

const updateOptionInMeanderConfig =
  ( state, payload ) => { 
    return state.config.map( configOption => {
      // If its the changed option
      if( configOption.optionName === payload.config.option.optionName ) {
        // Get value from slider or checkbox
        console.log("Looking at", configOption, payload);
        configOption.value = ( payload.config.option.type === 'range' ) 
                              ? parseInt(payload.config.value.value) 
                              : payload.config.value.checked;
      }
      return configOption;
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
      let {index, value} = action.payload.motif;
      let motif = state.motif.map(( y , i ) => (index === i) ? parseFloat(value) : y)
      return { ...state, ...{motif}}

    case UPDATE_CONFIG:
    //console.log("Action", action,"New config ", {config: updateOptionInMeanderConfig( state, action.payload)})
      return { ...state, ...{config: updateOptionInMeanderConfig( state, action.payload)}}

    case UPDATE_ALL_CONFIG:
    //console.log("Update all config",  state, action)
      return { ...state, ...{ config: updateAllConfig(state, action.payload)}}
    default:
      return state;
  }
}
