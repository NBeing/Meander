// Library
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { connect }   from "react-redux";
import { range, head }     from 'lodash'
import { from }      from 'rxjs/observable/from';
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { MotifSlider , ConfigSlider    } from "./sliders"
import { createNodeFromStoreConfig     } from "./util/util"
import { ConfigOption, OptionWithValue } from "./util/types"
import { updateMotif, updateConfig, updateAllConfig  } from "./store/actions/canvasActions"

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
  updatePropInConfig = ( _config, prop , value) =>{
    let _sides = _config.map( (o) => { 
      if( o.optionName === prop){
        o.value = value;
      }
      return o;
    })
    return _sides;
  }
  forFun = () => {    
    let take = 100;
    Rx.Observable.interval(20).take(take).subscribe( n => {
      let negOffset = ( n > (take /2) ) ? take - n : n;
      let _config = (store.getState() as any).canvas.config;
//       _config = this.updatePropInConfig(_config, 'depth', 4 );
      _config = this.updatePropInConfig(_config, 'numSegments', (negOffset  * 10) + 550 );
      _config = this.updatePropInConfig(_config, 'sideLength', (negOffset  * 5)  + 550);
      _config = this.updatePropInConfig(_config, 'lineWidth', (negOffset  * 2) + 10 * negOffset );
      //_config = this.updatePropInConfig(_config, 'sides', Math.floor(negOffset/10) + 3);
      this.props.onUpdateAllConfig(_config)
    }, e => { console.log(e); }, () => { 
      this.forFun();
    })
  }
  getFunButton = () => {
    return <button onClick = {this.forFun}> Fun button</button>
  }
  render() {
    
    return (
      <div>
          {this.getFunButton()}
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
  onUpdateMotif    : updateMotif,
  onUpdateConfig   : updateConfig,
  onUpdateAllConfig: updateAllConfig
}
export default connect(mapStateToProps, mapActionsToProps)(App)