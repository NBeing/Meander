// Library
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { connect }   from "react-redux";
import { range }     from 'lodash'
import { from }      from 'rxjs/observable/from';
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { updateMotif, updateConfig     } from "./store/actions/canvasActions"
import { MotifSlider , ConfigSlider    } from "./sliders"
import { createNodeFromStoreConfig     } from "./util/util"
import { ConfigOption, OptionWithValue } from "./util/types"

class App extends React.Component<any, any> {
  state$   : Rx.Observable<any> = from(store as any)
  canvasId : string             = 'c'
  meander  : any;
  stateSub : any;  
  constructor(props:any){
    super(props)
    this.props = props;
    this.init()
  }

  init(){
    this.stateSub = 
      this.state$
          .map(createNodeFromStoreConfig)
          .subscribe( state => this.handleCanvasEvent( state ))
  }

  handleCanvasEvent(state){
      if(this.meander) this.meander.cleanup()
      this.meander = new MeanderCanvas(this.canvasId, state)
  }

  generateMotifInputs = () => {
    return range(8).map( (option:any, i:number ) =>{
      return (
        <MotifSlider index={i} key={i} handleMotifChange={this.props.onUpdateMotif} />
      )
    })
  }
  
  generateInputs = () => {
    return (store.getState() as any).canvas.config.map( ( option:any ,i:number ) => (
      <ConfigSlider key={i} option={option} handleChange={this.props.onUpdateConfig} />
    ))
  }
  componentWillUnmount(){
    this.stateSub.unsubscribe();    
  }
  render() {
    
    return (
      <div>
          <canvas id={this.canvasId}></canvas>
          <div className="input-container">
              {this.generateInputs()}
          </div>
          <div className="input-container">
              {this.generateMotifInputs()}
          </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  canvas: state.canvas
})

const mapActionsToProps = {
  onUpdateMotif: updateMotif,
  onUpdateConfig: updateConfig
}
export default connect(mapStateToProps, mapActionsToProps)(App)