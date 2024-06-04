export type tMatrix = [number,number,number,number,number,number]

export type CantorConfig = {
  baseLen?    : number ,
  depth?      : number ,
  sides?      : number ,
  divisions   : number ,
  lineHeight? : number ,
  lineWidth?  : number ,
  makeLonger? : number 
}

export type MeanderConfig = {
  animate      : boolean,
  flip         : boolean,
  fitToSide    : boolean,
  sides        : number,
  sideLength   : number,
  depth        : number,
  baseRotation : number,
  numSegments  : number,
  lineWidth    : number,
  motifConfig  : any,
  red          : number,
  green        : number,
  blue         : number,
  drawEvery    : number,
  clearScreen  : boolean,
}
export type ConfigOption = {
  optionName : string,
  min        : number,
  max        : number,
  value      : any
}
export type OptionWithValue =  {
  option: string,
  value: string
}
