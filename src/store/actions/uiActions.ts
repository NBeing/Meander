export const UPDATE_UI = "UPDATE_UI"

export const updateUI = ( showOptions ) => { 
  return {
    type: UPDATE_UI,
    payload: {
      showOptions
    }
  }
}