import * as React from 'react'
import { useDispatch, useSelector }   from "react-redux"
import { range }     from 'lodash'

import { UPDATE_UI }  from '../store/actions/uiActions'
import { MotifSlider , ConfigSlider } from "../sliders"

import { 
  RootState, 
  UIConfig, 
  MotifDefinition, 
  MotifModOptions 
} from "../types"

const Config = (props) => {
  const uiConfig:UIConfig =
    useSelector((state:RootState) => state.config)
  
  const motifAngles:MotifDefinition =
    useSelector((state:RootState) => state.motifOptions.motifAngles)

  const motifModOptions:MotifModOptions =
    useSelector((state:RootState) => state.motifOptions.motifModOptions)

  const dispatch = useDispatch()
  
  const generateInputs = () => {
    return motifModOptions.map( ( option:any ,i:number ) => {
      console.log("Optchin", option)
      return (
        <ConfigSlider key={i} option={option} />
      )
    })
  }
  const generateMotifInputs = () => {
    return range(8).map( (option:any, i:number ) =>{
      return (
          <MotifSlider 
            option={option} 
            index={i} 
            key={i} 
            displayValue={motifAngles[i]} />
      )
    })
  }

  const onToggleConfig = () => {
    dispatch({
      type: UPDATE_UI, 
      payload: {showOptions: !uiConfig.showOptions }
    })
  }

  return( 
      
    <div className="config-container">
      <button 
        id="toggle"
        onClick={ onToggleConfig }>Show/Hide
      </button>

      {uiConfig.showOptions ? 
            <div className="config-container">
            {/* {this.getFunButton()} */}
            <div className="input-container">
                {generateInputs()}
            </div>
            <div className="input-container">
                {generateMotifInputs()}
            </div>
          </div>
     : null }
    </div>
  )
}

export default Config;
