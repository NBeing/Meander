import * as React from 'react';
import * as Rx    from 'rxjs';
import CantorCanvas from "./cantorCanvas"
import MeanderCanvas from "./meander"
import {range} from 'lodash'
import { ConfigOption,
         OptionWithValue } from "./types"

export default class App extends React.Component<any, any> {
  inputs      : any;
  motifInputs : any;
  meander     : any;

  meanderConfig: Array<any> =
    [{ optionName: 'depth'       , min: 0 , max:7     , value: 3   , type: 'range'    },
     { optionName: 'sides'       , min: 2 , max:25    , value: 7   , type: 'range'    },
     { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10  , type: 'range'    },
     { optionName: 'sideLength'  , min: 2 , max:1200  , value: 300 , type: 'range'    },
     { optionName: 'baseRotation', min: 0 , max:0     , value: 0   , type: 'range'    },
     { optionName: 'numSegments' , min: 2 , max:20000 , value: 300 , type: 'range'    },
     { optionName: 'flip'        , min: 0 , max:1     , value: 0   , type: 'checkbox' },
     { optionName: 'noAnimation' , min: 1 , max:9     , value: 0   , type: 'checkbox' },
     { optionName: 'fitToSide'   , min: 0 , max:1     , value: 1   , type: 'checkbox' },
    ]

  motif                = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0];
  handleMotifChange    = ( optionValue: OptionWithValue ) => this.motifInput$.next(optionValue)
  handleChange         = ( optionValue: OptionWithValue ) => this.formInput$.next(optionValue)

  motifInput$    : Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  formInput$     : Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);
  handlers$      : Rx.Observable<any>      = Rx.Observable.of({ handleChange: this.handleChange})
  motifHandlers$ : Rx.Observable<any>      = Rx.Observable.of({ handleChange: this.handleMotifChange})

  motif$: Rx.Observable<any> =
    Rx.Observable.merge( this.motifInput$ , this.motifHandlers$)
      .debounceTime(300)
      .distinctUntilChanged()
      .filter( x => x.value)
      .map( x => { x.value = parseFloat(x.value); return x;})
      .map((x: any) => {
        console.log("Got motif...", x);
        this.motif[x.option] = x.value;
        this.canvas$.next({event: 'update'});
      })

  canvas$: any =
    new Rx.BehaviorSubject({event: 'init'}).map((e:any) => this.handleCanvasEvent(e));

  merged$: Rx.Observable<any> =
    Rx.Observable.merge(
      this.formInput$,
      this.handlers$
    )
      .debounceTime(300)
      .distinctUntilChanged()
      .filter( x => x && x.option)
      .map((x:any) => {
        let val = ( x.option.type === 'range' ) ? parseInt(x.value.value) : x.value.checked;
        this.updateOptionInMeanderConfig( x.option.optionName , val );
        this.canvas$.next({event: 'update'});
      });

  constructor(props:any){
    super(props)
    this.init()
  }
  init(){
    this.inputs      = this.generateInputs();
    this.motifInputs = this.generateMotifInputs();
    this.canvas$.subscribe();
    this.merged$.subscribe();
    this.motif$.subscribe();
  }

  getOptionFromMeanderConfig =
    optionName => this.meanderConfig.filter( option => option.optionName == optionName );

  updateOptionInMeanderConfig =
    ( optionName , value ) => {
      this.meanderConfig = this.meanderConfig.map( configOption => {
        if( configOption.optionName === optionName ) {
          configOption.value = value;
        }
        return configOption;
      })
    }
  parseMeanderConfigToMeanderCanvasOptions =
    () => this.meanderConfig.reduce((acc:any, cur:any) =>{
      acc[cur.optionName] = cur.value;
      return acc;
    }, {})

  handleCanvasEvent(e){
    switch (e.event) {
      case 'init':
        let n = this.parseMeanderConfigToMeanderCanvasOptions();
        n.motifConfig = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0];
        this.meander = new MeanderCanvas('c', n ) ;
        break;
      case 'cleanup':
        this.meander.cleanup();
        break;
      case 'update':
        this.meander.cleanup();
        let node = this.parseMeanderConfigToMeanderCanvasOptions();
        /* node.motifConfig = [ 0,Math.PI/3,-Math.PI/3,0]
         * node.motifConfig = [0, Math.PI/2, -Math.PI/4, 0, 0, -Math.PI/3, -Math.PI/2, 0];*/
        node.motifConfig = this.motif;
        console.log("Using motif", this.motif);
        this.meander = new MeanderCanvas('c', node)
        break;
    }
  }
  generateMotifInputs = (node?: any) =>{
    return range(8).map( (option:any, i:any) =>{
      return (
        <div key={i} className="inputs">
          <input id={i}
            type="range"
            min={-360}
            max={360}
            onChange={(e:any) => this.handleMotifChange({ option: i ,
                                                          value: e.target.value })} />
        </div>
      )
    })
  }
  generateInputs = (node?:any) =>{
    return this.meanderConfig.map( ( option:any ,i:any ) => {
      return (
          <div key={i} className="inputs">
          <label>{option.optionName}</label>
          <input id={option.optionName}
                 type={option.type}
                 min={option.min}
                 max={option.max}
                 onChange={(e:any) => this.handleChange({ option, value: e.target})}
          />
          </div>)
    })}

  render() {

    return (
      <div>
        <canvas id="c"></canvas>
        <div className="input-container">
          {this.inputs}
        </div>
        <div className="input-container">
          {this.motifInputs}
        </div>
      </div>
    )
  }
}
