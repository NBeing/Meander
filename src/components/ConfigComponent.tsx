import * as React from 'react';
import { connect }   from "react-redux";
import { range }     from 'lodash'

import { store }     from "../store/rootStore"
import { updateMotif, updateConfig, updateAllConfig  } from "../store/actions/canvasActions"
import { updateUI } from '../store/actions/uiActions';
import { MotifSlider , ConfigSlider } from "../sliders"

class Config extends React.Component<any, any> {
  constructor(props){
    super(props)
  }
    generateInputs = () => {
    return (store.getState() as any).canvas.config.map( ( option:any ,i:number ) => (
      <ConfigSlider key={i} option={option} handleChange={this.props.onUpdateConfig} />
    ))
  }
  generateMotifInputs = () => {

    return range(8).map( (option:any, i:number ) =>{
      return (
          <MotifSlider index={i} key={i} displayValue={this.props.canvas.motif[i]} handleMotifChange={this.props.onUpdateMotif} />
      )
    })
  }
  UIWindow = () => { 
    return (
      <div className="config-container">
        {/* {this.getFunButton()} */}
        <div className="input-container">
            {this.generateInputs()}
        </div>
        <div className="input-container">
            {this.generateMotifInputs()}
        </div>
      </div>
  )}

  onToggleConfig = () => {
    this.props.onUpdateUI(!this.props.config.showOptions)
  }
  render(){
    console.log("Render container")
    return( 
      
      <div className="config-container">
        <button 
          id="toggle"
          onClick={ this.onToggleConfig }>Show/Hide
        </button>

        {this.props.config.showOptions ? <this.UIWindow/> : null }
      </div>
    )
  }
}


  const mapStateToProps = state => ({
    canvas: state.canvas,
    config: state.config

  })
  
  const mapActionsToProps = {
    onUpdateMotif    : updateMotif,
    onUpdateConfig   : updateConfig,
    onUpdateAllConfig: updateAllConfig,
    onUpdateUI       : updateUI,

  }
  export default connect(mapStateToProps, mapActionsToProps)(Config)