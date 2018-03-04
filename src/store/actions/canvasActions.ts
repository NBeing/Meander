export const CLEAR_CANVAS = "CLEAR_CANVAS"
export const UPDATE_MOTIF = "UPDATE_MOTIF"
export const UPDATE_CONFIG = "UPDATE_CONFIG"
export const clearCanvas = ( canvas ) => { 
  return {
  type: CLEAR_CANVAS,
  payload: {
    canvas
  }
}}
export const updateMotif = ( motif ) => { 
  return {
  type: UPDATE_MOTIF,
  payload: {
    motif
  }
}}

export const updateConfig = ( config ) => { 
  return {
  type: UPDATE_CONFIG,
  payload: {
    config
  }
}}