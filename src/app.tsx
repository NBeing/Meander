// Library
import * as hot from 'react-hot-loader';
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { from }      from 'rxjs/observable/from';
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { createNodeFromStoreConfig     } from "./util/util"
import Config from "./components/ConfigComponent"


const App = (props) => {
  const canvasId  : string = 'c'
  let stateSub  : any; 
  let state$    : Rx.Observable<any> = from(store as any)
  let meander;

  const handleCanvasEvent = (state) => {
    if(meander) meander.cleanup()
    meander = new MeanderCanvas(canvasId, state)
  }

  React.useEffect(() => {
    // stateSub.unsubscribe();    
    stateSub = 
      state$
        .map(createNodeFromStoreConfig)
        .subscribe( state => {
          return handleCanvasEvent( state )
        })

  }, []);
  //   updatePropInConfig = ( _config, prop , value) =>{
  //     let _sides = _config.map( option => { 
  //       if( option.optionName === prop){
  //         option.value = value;
  //       }
  //       return option;
  //     })
  //     return _sides;
  //   }
  //   /* Move fun stuff */
  //   getFunButton = () => {
  //     return <button onClick = {this.forFun}> Fun button</button>
  //   }
  //   forFun = () => {    
  //     let take = 100;
  //     Rx.Observable.interval(20).take(take).subscribe( n => {
  //       let negOffset = ( n > (take /2) ) ? take - n : n;
  //       let _config = (store.getState() as any).canvas.config;
  //       //_config = this.updatePropInConfig(_config, 'depth', 4 );
  //       _config = this.updatePropInConfig(_config, 'numSegments', (negOffset  * 10) + 550 );
  //       _config = this.updatePropInConfig(_config, 'sideLength', (negOffset  * 5)  + 550);
  //       _config = this.updatePropInConfig(_config, 'lineWidth', (negOffset  * 2) + 10 * negOffset );
  //       //_config = this.updatePropInConfig(_config, 'sides', Math.floor(negOffset/10) + 3);
  //       this.props.onUpdateAllConfig(_config)
  //     }, e => { console.log(e); }, () => { 
  //       this.forFun();
  //     })
  //   }
  return (
    <div>
        <canvas
          id={ canvasId }/>
        <Config renderCanvas={handleCanvasEvent} />
    </div>
  )
}
export default App;
