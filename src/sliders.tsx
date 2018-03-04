import * as React    from 'react';

export class ConfigSlider extends React.Component {
  props:any;
  constructor(props:any) {
    super(props);
    this.props = props;
  }

  render(){
    return (
      <div className="inputs">
          <label>{this.props.option.optionName}</label>
          <input id   ={this.props.option.optionName }
                 type ={this.props.option.type       }
                 min  ={this.props.option.min        }
                 max  ={this.props.option.max        }
                 onChange={(e:any) => this.props.handleChange({ option: this.props.option, value: e.target})}
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

  render(){
    return (
      <div className="inputs">
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
