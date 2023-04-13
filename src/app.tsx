// Library
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { connect }   from "react-redux";
import { from }      from 'rxjs/observable/from';
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { createNodeFromStoreConfig     } from "./util/util"
import { ConfigOption, OptionWithValue } from "./util/types"
import { updateMotif, updateConfig, updateAllConfig  } from "./store/actions/canvasActions"
import Config from "./components/ConfigComponent"

class App extends React.Component<any, any> {
  state$    : Rx.Observable<any> = from(store as any)
  canvasId  : string             = 'c'
  meander   : any;
  stateSub  : any; 
  canvas    : HTMLCanvasElement;
  showToggle: boolean; 

  constructor(props:any){
    super(props)
  }

  componentDidMount(): void {
    this.stateSub = 
      this.state$
          .map(createNodeFromStoreConfig)
          .subscribe( state => this.handleCanvasEvent( state ))
  }

  handleCanvasEvent = (state) => {
      if(this.meander) this.meander.cleanup()
      this.meander = new MeanderCanvas(this.canvasId, state)
  }

  componentWillUnmount(){
    this.stateSub.unsubscribe();    
  }
  updatePropInConfig = ( _config, prop , value) =>{
    let _sides = _config.map( option => { 
      if( option.optionName === prop){
        option.value = value;
      }
      return option;
    })
    return _sides;
  }
  /* Move fun stuff */
  getFunButton = () => {
    return <button onClick = {this.forFun}> Fun button</button>
  }
  forFun = () => {    
    let take = 100;
    Rx.Observable.interval(20).take(take).subscribe( n => {
      let negOffset = ( n > (take /2) ) ? take - n : n;
      let _config = (store.getState() as any).canvas.config;
      //_config = this.updatePropInConfig(_config, 'depth', 4 );
      _config = this.updatePropInConfig(_config, 'numSegments', (negOffset  * 10) + 550 );
      _config = this.updatePropInConfig(_config, 'sideLength', (negOffset  * 5)  + 550);
      _config = this.updatePropInConfig(_config, 'lineWidth', (negOffset  * 2) + 10 * negOffset );
      //_config = this.updatePropInConfig(_config, 'sides', Math.floor(negOffset/10) + 3);
      this.props.onUpdateAllConfig(_config)
    }, e => { console.log(e); }, () => { 
      this.forFun();
    })
  }
  /* Move fun stuff */

  render() {
    return (
      <div>
          <canvas
            id={ this.canvasId }
            ref={(canvas:HTMLCanvasElement) => {
              this.canvas = canvas;
            }} />
          <Config props={this.props}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  canvas: state.canvas,
})

const mapActionsToProps = {
  onUpdateMotif    : updateMotif,
  onUpdateConfig   : updateConfig,
  onUpdateAllConfig: updateAllConfig,
}
export default connect(mapStateToProps, mapActionsToProps)(App)