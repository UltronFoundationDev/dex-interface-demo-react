const initState = false

const SET_LOADER = 'SET_LOADER'

export const loader = (state = initState, action) => {
  switch (action.type) {
    case SET_LOADER:
      return action.data

    default:
      return state;
  }
}

export const setLoader = (data) => ({type: SET_LOADER, data})
