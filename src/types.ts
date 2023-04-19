export interface MotifModOption { 
  optionName: string,
  min: number,
  max: number,
  value: number | boolean,
  type: string
}
export type MotifModOptions = Array<MotifModOption>
export type MotifDefinition = number[]

export type MotifOptionsReducerState = {
  motifAngles: MotifDefinition
  motifModOptions: MotifModOptions
} 

export interface UIConfig {
  showOptions: boolean
}


export type RootState = {
  motifOptions: MotifOptionsReducerState;
  config: UIConfig;
};