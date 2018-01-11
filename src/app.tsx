import * as React from 'react';
import * as Rx    from 'rxjs';
import CantorCanvas from "./cantorCanvas"
import MeanderCanvas from "./meander"
import Sidebar from 'react-sidebar'
import Drawer from 'react-motion-drawer';

const SideBar:any = Drawer;
console.log("S", Sidebar);

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
     { optionName: 'sides'       , min: 2 , max:10    , value: 7   },
     { optionName: 'lineWidth'   , min: 0 , max:400   , value: 10  },
     { optionName: 'base'        , min: 2 , max:100   , value: 8   },
     { optionName: 'sideLength'  , min: 2 , max:800   , value: 300 },
     { optionName: 'baseRotation', min: 2 , max:800   , value: 0   },
     { optionName: 'numSegments' , min: 2 , max:20000 , value: 300 },
     { optionName: 'flip'        , min: 0 , max:1     , value: 0   , type: 'checkbox' },
     { optionName: 'noAnimation' , min: 1 , max:9     , value: 0   , type: 'checkbox' },

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
        if(!x || !x.option) return;
        if(x.option.max &&  x.value > x.option.max ) return;

        return this.meanderConfig.filter( option =>{
          return option.optionName == x.option.optionName;
        }).map( (y:any) => {
          y.value = x.value;
          let node = this.meanderConfig.reduce((acc:any, cur:any) =>{
            if(cur && cur.type == 'checkbox' ){
              console.log("cur", cur);
              if(cur.value == 'on'  ){ cur.value = true; }
              if(cur.value == 'off' ){ cur.value = false; }
            }
            if(typeof cur.value === 'string') cur.value = parseInt(cur.value)
            acc[cur.optionName] = cur.value;
            return acc;
          }, {})
          //          new CantorCanvas( 'c', node)
          this.inputs = this.generateInputs(node);
          node.motifConfig = [0, Math.PI/2, -Math.PI/4, 0,
                              0, -Math.PI/3, -Math.PI/2, 0]
          console.log("Creating",node);
          new MeanderCanvas('c', node)
        });
    })

  constructor(props:any){
    super(props)
    this.init()

    this.state = {
      sidebarOpen: false
    }

    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open: any) {
    this.setState({sidebarOpen: open});
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
  generateInputs = (node?:any) =>{
    return this.meanderConfig.map( ( option:any ,i:any ) => {
      return (
          <div key={i} className="inputs">
          <label>{option.optionName}</label>
          <input id={option.optionName}
                 type={option.type ? option.type : "range"}
                 min={option.min}
                 max={option.max}
                 onChange={(e:any) => this.handleChange({ option, value: e.target.value })}
          />
          </div>)
    })}

  render() {

    var sidebarContent = <b>Sidebar content</b>;
    const { openLeft, openRight } = this.state;
    return (
        <div className="input-container">
          {this.inputs}
        </div>
    )
  }
}
