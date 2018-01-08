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
    baseRotation : 0
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
        return this.configOptions.filter( option =>{
          return option.optionName == x.option.optionName;
        }).map( (y:any) => {
          y.value = x.value;
          let node = this.configOptions.reduce((acc:any, cur:any) =>{
            acc[cur.optionName] = parseInt(cur.value)
            return acc;
          }, {})
          new CantorCanvas( 'c', node)

       });
      }
    })

  constructor(props:any){
    super(props)
    this.init()

  }

  init(){
      /* new MeanderCanvas('c', createDefaultMeanderConfig());*/
      /* new MeanderCanvas('c',{
       *     sides        : 3,
       *     flip         : false,
       *     sideLength   : 400,
       *     depth        : 4,
       *     baseRotation : 0
       * });*/
      new MeanderCanvas('c',{
          sides        : 5,
          flip         : false,
          sideLength   : 400,
          depth        : 3,
          baseRotation : 0
      });
      new MeanderCanvas('c',{
          sides        : 5,
          flip         : true,
          sideLength   : 400,
          depth        : 3,
          baseRotation : 0
      });
    this.merged$.subscribe( x => console.log(x));
    this.inputs = this.generateInputs();
    let node = this.configOptions.reduce((acc:any, cur:any) =>{
      acc[cur.optionName] = parseInt(cur.value)
      return acc;
    }, {})
    /* new CantorCanvas( 'c', node)*/
  }
  generateInputs = () =>{
    return this.configOptions.map( ( option:any ,i:any ) => {
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
