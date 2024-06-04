// Library
import * as hot from 'react-hot-loader';
import * as React    from 'react';
import * as Rx       from 'rxjs';
import { from }      from 'rxjs/observable/from';
import { WebMidi }   from 'webmidi'
import { store }     from "./store/rootStore"
import MeanderCanvas from "./service/meander"
import { createNodeFromStoreConfig     } from "./util/util"
import Config from "./components/ConfigComponent"
import LFO from "./util/LFO"
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_MOTIF, UPDATE_ALL_MOTIFS, UPDATE_CONFIG } from './store/actions/canvasActions';
import { MotifModOptions, RootState, UIConfig } from './types';
import { noteLengths, Knobs } from './knobs'

import GlobalTimer from "./util/GlobalTimer"
import { EventBus, MidiTracker } from "./util/eventBus"
import { lerp, clamp, floorClamp, parabolic, impulse } from './util/smoothingFunctions'

const globalTimer = new GlobalTimer()
const eventBus = new EventBus()
const midiTracker = new MidiTracker(eventBus, 8)
const knobTracker = new Knobs()

knobTracker.addKnobHandler("knobTrackerTest", 176,"value", 0, {})
knobTracker.addKnobHandler("knobTrackerTest2", 10,"value", 50, {})
knobTracker.addKnobHandler("knobTrackerTest3", 74,"cycle", 0, {
  arrayToCycle: noteLengths
})


// We want an event where we start a timer based on the real existent time
// The midi clock --> eventbus must start the event, but it needs to tick in "real time"
// Todo : make this into a class?
const timers = {}
let last_time = 0;
const updateTimers = (timeElapsedSinceStart) => {
  const timeDelta = timeElapsedSinceStart - last_time 
  // console.log("delta", timeDelta )
  const keys = Object.keys(timers)
  if(keys.length > 0){
    keys.forEach(key =>{ 
      timers[key].hasRunFor += timeDelta
      if(timers[key].type == "INC"){
        timers[key].value += timeDelta
        if(timers[key].value >= timers[key].runUntil){
          delete timers[key]
        }
      } else {
        if(timers[key].type = "CUSTOM"){
          timers[key].value = timers[key].func(timers[key])
          if(timers[key].hasRunFor >= timers[key].runUntil){
            delete timers[key]
          }
        }
      }
    })
  }
  last_time = timeElapsedSinceStart
}
const spawnTimer = (
  name, type="INC",
  func = null,
  startingValue = 0,
  runUntil = 2, 
  customData = {},
  locked = false,
) => {
  // console.log("Spawning", name, func)
  // delete timers[name]
  timers[name] = {
    timeStarted: globalTimer.getSecondsElapsed(),
    name,
    type,
    startingValue,
    value: startingValue,
    runUntil,
    hasRunFor: 0,
    isFinished: false,
    func,
    customData,
    locked,
  }
}


// Subscribe to events
eventBus.subscribe("nameEvent", (func, num) => {
  if(typeof func === "function"){
    func()
  }
});

// These values may be for the BSP and not universal
const MIDI_STOP_MSG = 252

const getElapsedTimePercentageForTimer = (timer) => {
  return clamp(
    lerp(timer.startingValue,timer.customData.maxValue, timer.hasRunFor /  timer.runUntil),
    timer.customData.maxValue
  )
}

knobTracker.addKnobHandler("knobTrackerTest3", 176,"cycle", 0, {
  arrayToCycle: noteLengths
})

const MappedMidiNotes = [
  { note: "E3", behavior: { func: () => { }}}
]
const getMappedNote = note => {
  return MappedMidiNotes.filter( x => { return x.note == note })[0] || null
} 
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
    const colorLFORed = new LFO(0,255,30);

    console.log("Use effect")
    eventBus.subscribe("runNow", (func, num) => {
      func()
    })
    const onWebMidiEnabled = () => {
      console.log("enabled")
      console.log("Inputs", WebMidi.inputs)
      const midiInput = WebMidi.getInputByName("KeyStep Pro MIDI IN")
      const twister = WebMidi.getInputByName("Midi Fighter Twister")
      midiInput.addListener("clock", (e) => {
        midiTracker.tick(e)
      })
    
      twister.addListener("controlchange", (e) => {
        console.log(e)
        knobTracker.updateKnobs(e)
      })
      midiInput.addListener("noteon", e => {
        console.log(e.note.identifier);
        const action = getMappedNote(e.note.identifier)
        if(action){
          console.log("action" , action)
          action.behavior.func()
        }
        if(e.note.identifier == "C2" /*&& e.message.channel == 9*/){
          midiTracker.runEventNow(
            {
              name: "runNow",
              func: () => {
                  spawnTimer(
                    "my_time",
                    "CUSTOM", 
                    (timer) =>{
                      let timePercent = getElapsedTimePercentageForTimer(timer)
                      // val = impulse(knobTrackers[114],val)
                      // val = impulse(12.0,val)
                      let val = impulse(timePercent, 1.0)
                      // console.log("val, ",val, 255 * val)
                      // console.log(midiTracker.getTimeForNoteLength(1/4, true))
                      // console.log("Test",lerp(timer.startingValue,timer.customData.maxValue,timePercent))
                      dispatch({
                        type: UPDATE_CONFIG, 
                        payload:{
                        option:           
                          { optionName: 'red'  , min: 0 , max:255  , value: 0   , type: 'range' },
                          value: 255 * val
                      }
                      })
                      return val
                    },
                    0,
                    midiTracker.getTimeForNoteLength(1/2, true),
                    {maxValue : 1 }
                  )
              },
            },
            0,
            1
          )
        }
        if(e.note.identifier == "D2" /*&& e.message.channel == 9*/){
          midiTracker.runEventNow(
            {
              name: "runNow",
              func: () => {
                  spawnTimer(
                    "my_time",
                    "CUSTOM", 
                    (timer) =>{
                      let timePercent = getElapsedTimePercentageForTimer(timer)
                      // val = impulse(knobTrackers[114],val)
                      // val = impulse(12.0,val)
                      let val = parabolic(timePercent, 1.0)
                      // console.log("val, ",val, 255 * val)
                      // console.log(midiTracker.getTimeForNoteLength(1/4, true))
                      // console.log("Test",lerp(timer.startingValue,timer.customData.maxValue,timePercent))
                      dispatch({
                        type: UPDATE_CONFIG, 
                        payload:{
                        option: { optionName: 'depth'       , min: -1000 , max:2000  , value: 1     , type: 'range'    },
                          value: -1000 + val * 2000
                      }
                      })
                      return val
                    },
                    0,
                    midiTracker.getTimeForNoteLength(1, true),
                    {maxValue : 1 }
                  )
              },
            },
            0,
            1
          )
        }
    
    })
  }    


    function onMIDIFailure() {
      console.log('Could not access your MIDI devices.');
    }
    WebMidi.enable()
      .then(onWebMidiEnabled)
      .catch(()=> {
        console.log("Could not init webmidi"); 
        onMIDIFailure()
      })
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
    // const colorLFORed = new LFO(0,255,30);
    const colorLFOGreen = new LFO(0,255,10);
    const colorLFOBlue = new LFO(0,255,10);
    const depthLFO = new LFO(-500, 200, 20)


    // Redraws the canvas with the browser framerate
    // window.requestAnimationFrame(function(){
    // });
    const mainLoop = () => {
      updateTimers(globalTimer.getSecondsElapsed())

      // console.log("myLFO", myLFO.getSin());      
      // if(
      //   motifModOptions.filter( (option) => { return option.optionName === "animate"})[0].value == false
      //   ){  
      //   const configMod = [
      //     myLFO3.getSin() / 2, 
      //     myLFO3.getSin() / 3,
      //     myLFO3.getSin() / 4,
      //     myLFO3.getSin() / 5,
      //     myLFO3.getSin() / 2,
      //     myLFO3.getSin() / 3,
      //     myLFO3.getSin() / 4,
      //     myLFO3.getSin() / 5,
      //   ]
      //   dispatch({
      //     type: UPDATE_ALL_MOTIFS, 
      //     payload: [ 
      //       myLFO3.getSin() + configMod[0], 
      //       myLFO3.getSin() + configMod[1],
      //       myLFO3.getSin() + configMod[2],
      //       myLFO3.getSin() + configMod[3],
      //       myLFO3.getSin() + configMod[4],
      //       myLFO3.getSin() + configMod[5],
      //       myLFO3.getSin() + configMod[6],
      //       myLFO3.getSin() + configMod[7],
      //     ]
      //   })
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option:           
      //       { optionName: 'sideLength'  , min: 2 , max:1200  , value: 300   , type: 'range' },
      //       value: myLFO4.getSin() / 4
      //   }
      //   })
      //   // dispatch({
      //   //   type: UPDATE_CONFIG, 
      //   //   payload:{
      //   //   option:           
      //   //   { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10    , type: 'range'    },
      //   //   value: myLFO4.getSin() / 2
      //   // }
      //   // })
  
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option:           
      //       { optionName: 'red'  , min: 0 , max:255  , value: 300   , type: 'range' },
      //       value: colorLFORed.getSin()
      //   }
      //   })
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option:           
      //       { optionName: 'green'  , min: 0 , max:255  , value: 300   , type: 'range' },
      //       value: colorLFOGreen.getSin(),
      //   }
      //   })
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option:           
      //       { optionName: 'blue'  , min: 0 , max:255  , value: 300   , type: 'range' },
      //       value: colorLFOBlue.getSin(),
      //   }
      //   })
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option: {
      //         max: 20000,
      //         min: 2,
      //         optionName: "numSegments",
      //         type: "range",
      //         value: 1057,
      //       },
      //       value: myLFO2.getSin()
      //   }
      //   })
      //   dispatch({
      //     type: UPDATE_CONFIG, 
      //     payload:{
      //     option: { optionName: 'depth'       , min: -1000 , max:2000  , value: 1     , type: 'range'    },
      //       value: depthLFO.getSin()
      //   }
      //   })
      // }

    }
    var elapsed = 0
    var tickTime = 20
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
