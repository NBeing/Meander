// Library
import * as hot from 'react-hot-loader';
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { from }      from 'rxjs/observable/from';
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { createNodeFromStoreConfig     } from "./util/util"
import Config from "./components/ConfigComponent"
import LFO from "./util/LFO"
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_MOTIF, UPDATE_ALL_MOTIFS, UPDATE_CONFIG } from './store/actions/canvasActions';
import { MotifModOptions, RootState, UIConfig } from './types';


const App = (props) => {
  const canvasId : string = 'c'
  let stateSub   : any; 
  let state$     : Rx.Observable<any> = from(store as any)
  let meander;

  const motifModOptions:MotifModOptions =
    useSelector((state:RootState) => state.motifOptions.motifModOptions)

  const dispatch = useDispatch();
  
  const handleCanvasEvent = (state) => {
    if(!meander){
      meander = new MeanderCanvas(canvasId, state)
    } else {

      // meander.clearCanvas();
      meander.update(state);
      // meander = new MeanderCanvas(canvasId, state)
    }

    // if(meander) meander.cleanup()
    // // console.log("New")
    // meander = new MeanderCanvas(canvasId, state)

  }

  React.useEffect(() => {
    // stateSub.unsubscribe();    
    stateSub = 
      state$
        .map(createNodeFromStoreConfig)
        .subscribe( state => {
          return handleCanvasEvent( state )
        })

    const myLFO = new LFO(1, 360, 960);
    const myLFO2 = new LFO(1, 360, 8);
    const myLFO3 = new LFO(1, 1000, 960);
    const myLFO4 = new LFO(1, 2000, 30);
    const colorLFORed = new LFO(0,255,30);
    const colorLFOGreen = new LFO(0,255,10);
    const colorLFOBlue = new LFO(0,255,10);
    const depthLFO = new LFO(-500, 200, 20)


    // window.requestAnimationFrame(function(){
    // });
    // Redraws the canvas with the browser framerate
    const mainLoop = () => {
      // console.log("myLFO", myLFO.getSin());      
      if(
        motifModOptions.filter( (option) => { return option.optionName === "noAnimation"})[0].value == false
        ){  
        const configMod = [
          myLFO3.getSin() / 2, 
          myLFO3.getSin() / 3,
          myLFO3.getSin() / 4,
          myLFO3.getSin() / 5,
          myLFO3.getSin() / 2,
          myLFO3.getSin() / 3,
          myLFO3.getSin() / 4,
          myLFO3.getSin() / 5,
        ]
        dispatch({
          type: UPDATE_ALL_MOTIFS, 
          payload: [ 
            myLFO3.getSin() + configMod[0], 
            myLFO3.getSin() + configMod[1],
            myLFO3.getSin() + configMod[2],
            myLFO3.getSin() + configMod[3],
            myLFO3.getSin() + configMod[4],
            myLFO3.getSin() + configMod[5],
            myLFO3.getSin() + configMod[6],
            myLFO3.getSin() + configMod[7],
          ]
        })
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option:           
            { optionName: 'sideLength'  , min: 2 , max:1200  , value: 300   , type: 'range' },
            value: myLFO4.getSin() / 4
        }
        })
        // dispatch({
        //   type: UPDATE_CONFIG, 
        //   payload:{
        //   option:           
        //   { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10    , type: 'range'    },
        //   value: myLFO4.getSin() / 2
        // }
        // })
  
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option:           
            { optionName: 'red'  , min: 0 , max:255  , value: 300   , type: 'range' },
            value: colorLFORed.getSin()
        }
        })
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option:           
            { optionName: 'green'  , min: 0 , max:255  , value: 300   , type: 'range' },
            value: colorLFOGreen.getSin(),
        }
        })
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option:           
            { optionName: 'blue'  , min: 0 , max:255  , value: 300   , type: 'range' },
            value: colorLFOBlue.getSin(),
        }
        })
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option: {
              max: 20000,
              min: 2,
              optionName: "numSegments",
              type: "range",
              value: 1057,
            },
            value: myLFO2.getSin()
        }
        })
        dispatch({
          type: UPDATE_CONFIG, 
          payload:{
          option: { optionName: 'depth'       , min: -1000 , max:2000  , value: 1     , type: 'range'    },
            value: depthLFO.getSin()
        }
        })
      }

    }
    var elapsed = 0
    var tickTime = 100
    var lastTickTime = Date.now() 

    function animationLoop(tick) {
        var diff = Date.now() - lastTickTime;

        if (diff > tickTime) {
            elapsed = 0;
            lastTickTime = Date.now()
            mainLoop()   
        }
        window.requestAnimationFrame(animationLoop);
    }
    window.requestAnimationFrame(animationLoop);    
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
