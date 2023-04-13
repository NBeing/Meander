import * as React    from 'react';

export class ConfigSlider extends React.Component {
  props:any;
  constructor(props:any) {
    super(props);
    this.props = props;
  }
  // TODO
  debouncedHandleChange = (option, e) => {
    this.props.handleChange({ option: option, value: e.target})
  }

  render(){
    return (
      <div className="inputs">
          <label>{this.props.option.optionName}</label>
          <input id   ={this.props.option.optionName }
                 type ={this.props.option.type       }
                 min  ={this.props.option.min        }
                 max  ={this.props.option.max        }
                 onChange={(e:any) => this.debouncedHandleChange(this.props.option, e)}
          />
      </div>
    )
  }
}

export class MotifSlider extends React.Component {
  props:any;
  constructor(props:any) {
    super(props);
    this.props = props;
  }
  radiansToAngle(radians){
    // 1rad × 180/π = 57.296°
    return radians * 180/Math.PI;
  }
  render(){
    return (
      <div className="inputs">
          <label>Position : {this.props.index} Angle: {this.props.displayValue.toFixed(1)}</label>
          <input id={this.props.index}
                 type="range"
                 min={-360}
                 max={360}
                 onChange={(e:any) => this.props.handleMotifChange({ index: this.props.index,
                                                                     value: e.target.value })} />
      </div>
    )
  }
}
