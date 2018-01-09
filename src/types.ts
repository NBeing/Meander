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
  sides        : number,
  flip         : boolean,
  sideLength   : number,
  depth        : number,
  baseRotation : number,
  base         : number,
  numSegments  : number,
  lineWidth    : number,
  motifConfig  : any,
  noAnimation  : boolean
}
