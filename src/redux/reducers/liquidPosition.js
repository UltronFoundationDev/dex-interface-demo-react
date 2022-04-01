const initState = []

const SET_LIQUID_POSITION = 'SET_LIQUID_POSITION'

export const liquidPosition = (state = initState, action) => {
  switch (action.type) {
    case SET_LIQUID_POSITION:
      localStorage.setItem('liquid-position', JSON.stringify(action.data))
      return action.data

    default:
      return state;
  }
}

export const setLiquidPosition = (data) => ({type: SET_LIQUID_POSITION, data})
