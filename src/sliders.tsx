import * as React    from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { UPDATE_CONFIG, UPDATE_MOTIF } from './store/actions/canvasActions';

// This slider is for the motif options
const useSlider = (type, min, max, defaultState, step, label, id, index) => {
  const [state, setSlide] = useState(defaultState);
  const dispatch = useDispatch()

  const handleChange = e => {
    setSlide(e.target.value);
    dispatch({
      type: UPDATE_MOTIF, 
      payload: { index: index, value: e.target.value }
    })
  }
  const props = { 
    type,
    id,
    min,
    max,
    step,
    value: state,
    onChange: handleChange
  }
  return props
}
const useConfigCheckbox = (type, min, max, defaultState, step, label, id, index, option, onUpdate) => {
  const [state, setSlide] = useState(defaultState);
  const dispatch = useDispatch()
  const handleChange = e => {
    let value 
    value = e.target.checked

    setSlide(value);
    dispatch({
      type: UPDATE_CONFIG, 
      payload: { option: option, checked: e.target.checked }
    })
  }
  const props = { 
    type,
    id,
    min,
    max,
    step,
    checked: state,
    onChange: handleChange
  }
  return props
}
const useConfigSlider = (type, min, max, defaultState, step, label, id, index, option, onUpdate) => {
  const [state, setSlide] = useState(defaultState);
  const dispatch = useDispatch()
  const handleChange = e => {
    let value 
    value = e.target.value
    setSlide(value);
    dispatch({
      type: UPDATE_CONFIG, 
      payload: { option: option, value }
    })
  }
  const props = { 
    type,
    id,
    min,
    max,
    step,
    value: state,
    onChange: handleChange
  }
  return props
}
export function ConfigSlider(props){
  const sliderProps = props.option.type !== 'checkbox' ? useConfigSlider(
    props.option.type, 
    props.option.min, 
    props.option.max, 
    props.option.value,
    1,
    props.option.label, 
    props.option.id, 
    props.option.index,
    props.option,
    props.renderCanvas,
  ) 
  : useConfigCheckbox(
    props.option.type, 
    props.option.min, 
    props.option.max, 
    props.option.checked,
    1,
    props.option.label, 
    props.option.id, 
    props.option.index,
    props.option,
    props.renderCanvas,
  );
  const _sliderProps = {...sliderProps, ...{checked: props.option.checked == true }}
  if(props.option.type !== 'checkbox'){
    return (
      <div className="inputs">
        <label>{props.option.optionName}</label>
        <label>({props.option.value})</label>
            <input {..._sliderProps}/>
        </div>
    )
  } else { 
    return (
      <div className="inputs">
        <label>{props.option.optionName}</label>
        <label>({props.option.value})</label>
            <input {..._sliderProps} checked={props.option.checked}/>
        </div>
    )

  }
}

export function MotifSlider(props){
  const sliderProps = useSlider("range", -360, 360, 0, 0.5,"Threshold", 'threshold', props.index);
  return (
    <div className="inputs">
      <label>Position : {props.index} Angle: {props.displayValue.toFixed(1)}</label>
       <input {...sliderProps }/>
    </div>
  )
}
