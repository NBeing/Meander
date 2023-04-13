export const UPDATE_MOTIF = "UPDATE_MOTIF"
export const UPDATE_CONFIG = "UPDATE_CONFIG"
export const UPDATE_ALL_CONFIG = "UPDATE_ALL_CONFIG"

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

export const updateAllConfig = ( config ) => { 
  return {
  type: UPDATE_ALL_CONFIG,
  payload: {
    config
  }
}}