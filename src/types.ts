export interface MotifModOption { 
  optionName: string,
  min: number,
  max: number,
  value?: number | boolean,
  checked?: boolean,
  type: string
}
export interface MotifCheckboxOption { 
  optionName: string,
  min: number,
  max: number,
  checked: boolean,
  type: string
}
export type MotifModOptions = Array<MotifModOption | MotifCheckboxOption>
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