// Library
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { connect }   from "react-redux";
import { range}      from 'lodash'
import { from }      from 'rxjs/observable/from';

// Meat and potatoes
import MeanderCanvas from "./service/meander"

// Redux Helpers
import { store } from "./store/rootStore"
import { clearCanvas, updateMotif, updateConfig } from "./store/actions/canvasActions"

// View Components
import { MotifSlider , ConfigSlider } from "./sliders"

// Utilities
import { hasKey, parseFloatByKey, mergeDebounceDistinct} from "./util/util"
import { ConfigOption, OptionWithValue } from "./util/types"

// Cool Configs
/* node.motifConfig = [ 0,Math.PI/3,-Math.PI/3,0]
 * node.motifConfig = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0];*/

 class App extends React.Component<any, any> {
  state$   : Rx.Observable<any> = from(store as any)
  canvasId : string             = 'c'
  meander  : any;
  
  handleMotifChange    = ( optionValue: OptionWithValue ) => this.motifInput$.next(optionValue)
  handleChange         = ( optionValue: OptionWithValue ) => this.formInput$.next(optionValue)

  motifInput$    : Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null)
  formInput$     : Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null)
  handlers$      : Rx.Observable<any>      = Rx.Observable.of({ handleChange: this.handleChange      })
  motifHandlers$ : Rx.Observable<any>      = Rx.Observable.of({ handleChange: this.handleMotifChange })

  motif$: Rx.Observable<any> =
    mergeDebounceDistinct( this.motifInput$ , this.motifHandlers$ )
      .filter(hasKey('value'))
      .map(parseFloatByKey('value'))
      .map(this.props.onUpdateMotif)

  merged$: Rx.Observable<any> =
    mergeDebounceDistinct( this.formInput$, this.handlers$ )
      .filter(hasKey('option'))
      .map(this.props.onUpdateConfig);

  constructor(props:any){
    super(props)
    this.props = props;
    this.init()
  }

  init(){
    this.merged$.subscribe();
    this.motif$.subscribe();
    this.state$.subscribe( state => this.handleCanvasEvent( state ))
  }

  parseMeanderConfigToMeanderCanvasOptions =
    config => config.reduce(this.addOption, {})

  addOption = (acc:any, cur:any) => {
    acc[cur.optionName] = cur.value
    return acc
  }
  createNodeFromStore 
    = state => Object.assign({}, 
      this.parseMeanderConfigToMeanderCanvasOptions(state.canvas.config),
      {motifConfig: state.canvas.motif});

  handleCanvasEvent(state){
      if(this.meander) this.meander.cleanup();
      this.meander = 
        new MeanderCanvas(this.canvasId, this.createNodeFromStore(state))
  }
  generateMotifInputs = () => {
    return range(8).map( (option:any, i:number ) =>{
      return (
        <MotifSlider index={i} key={i} handleMotifChange={this.handleMotifChange} />
      )
    })
  }
  generateInputs = () => {
    return (store.getState() as any).canvas.config.map( ( option:any ,i:number ) => (
      <ConfigSlider key={i} option={option} handleChange={this.handleChange} />
    ))
  }
  onCanvasClear = () => {
    this.props.onCanvasClear(this.meander)
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
  products: state.products,
  users: state.users,
  canvas: state.canvas
})

const mapActionsToProps = {
  onCanvasClear: clearCanvas,
  onUpdateMotif: updateMotif,
  onUpdateConfig: updateConfig
}
export default connect(mapStateToProps, mapActionsToProps)(App)