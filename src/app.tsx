//const styles = require('./index.scss')
import * as React from 'react';
import * as Rx    from 'rxjs';
import CantorCanvas from "./cantorCanvas"
import MeanderCanvas from "./meander"


function createDefaultMeanderConfig(){
  return {
    sides        : 3,
    flip         : true,
    sideLength   : 400,
    depth        : 4,
    baseRotation : 0,
    base : 4
  }
}
type ConfigOption = {
  optionName : string,
  min        : number,
  max        : number,
  value      : number
}
type OptionWithValue =  {
  option: string,
  value: string
}
export default class App extends React.Component<any, any> {
  inputs: any;
  configOptions:Array<ConfigOption> =
    [{ optionName: 'depth'      , min: 0 , max:7   , value: 3   },
     { optionName: 'baseLen'    , min: 0 , max:400 , value: 200 },
     { optionName: 'sides'      , min: 2 , max:100 , value: 3   },
     { optionName: 'lineHeight' , min: 0 , max:400 , value: 10  },
     { optionName: 'lineWidth'  , min: 0 , max:400 , value: 1   },
     { optionName: 'divisions'  , min: 1 , max:9   , value: 3   },
     { optionName: 'makeLonger' , min: 0 , max:100 , value: 0  }]

  meanderConfig: Array<any> =
    [{ optionName: 'depth'       , min: 0 , max:7     , value: 3   },
     { optionName: 'flip'        , min: 0 , max:1     , value: 0   , type: 'checkbox' },
     { optionName: 'sides'       , min: 2 , max:10    , value: 7   },
     { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10  },
     { optionName: 'noAnimation' , min: 1 , max:9     , value: 0   },
     { optionName: 'base'        , min: 2 , max:100   , value: 8   },
     { optionName: 'sideLength'  , min: 2 , max:800   , value: 300 },
     { optionName: 'baseRotation', min: 2 , max:800   , value: 0   },
     { optionName: 'numSegments' , min: 2 , max:20000 , value: 300 }
    ]

  formInput$: Rx.BehaviorSubject<any> = new Rx.BehaviorSubject(null);

  handleChange = ( optionValue: OptionWithValue ) => this.formInput$.next(optionValue)

  handlers$: Rx.Observable<any> = Rx.Observable.of({ handleChange: this.handleChange})

  merged$: Rx.Observable<any> =
    Rx.Observable.merge(
      this.formInput$,
      this.handlers$
    )
    .debounceTime(300)
    .distinctUntilChanged()
    .map((x:any) => {
      if(x && x.option && (x.value <= x.option.max )){
        return this.meanderConfig.filter( option =>{
          return option.optionName == x.option.optionName;
        }).map( (y:any) => {
          y.value = x.value;
          let node = this.meanderConfig.reduce((acc:any, cur:any) =>{
            acc[cur.optionName] = parseInt(cur.value)
            return acc;
          }, {})
          //          new CantorCanvas( 'c', node)
          node.noAnimation = false;
          node.flip = false;
          node.motifConfig = [0, Math.PI/2, -Math.PI/4, 0,
                              0, -Math.PI/3, -Math.PI/2, 0]
          console.log("Creating",node);
          try{
            new MeanderCanvas('c', node)
          } catch(e){ console.log("X", e);}

          });
      }
    })

  constructor(props:any){
    super(props)
    this.init()

  }

  init(){
    new MeanderCanvas('c',{
      noAnimation  : false,
      sides        : 7,
      flip         : false,
      sideLength   : 300,
      depth        : 3,
      baseRotation : 0,
      base         : 8,
      numSegments  : 3000,
      lineWidth    : 10,
      motifConfig  : [0, Math.PI/2, -Math.PI/4, 0,
                      0, -Math.PI/3, -Math.PI/2, 0]
    });
    this.merged$.subscribe( x => console.log(x));
    this.inputs = this.generateInputs();
    let node = this.meanderConfig.reduce((acc:any, cur:any) =>{
      acc[cur.optionName] = parseInt(cur.value)
      return acc;
    }, {})

    /* new CantorCanvas( 'c', node)*/
  }
  generateInputs = () =>{
    return this.meanderConfig.map( ( option:any ,i:any ) => {
      return (
          <div key={i}>
          <label>{option.optionName}</label>
          <input id={option.optionName}
                 type="range"
                 min={option.min}
                 max={option.max}
                 onChange={(e:any) => this.handleChange({ option, value: e.target.value })}
          />
          </div>)
    })}

  render() {
    return (
      <div>
        {this.inputs}
      </div>
    )
  }
}
