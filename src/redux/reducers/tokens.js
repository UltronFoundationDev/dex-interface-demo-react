const initState = {
  tokens: [
    {
      id: 1,
      name: 'USDT',
      address: '0x7db03a15Aa2A1Cd87034FE2E9e08D2e422f51c9A'
    },
    {
      id: 2,
      name: 'SOL',
      address: '0x7740B7a39AED690075E05a5335fcC7C2D6E04311'
    },
    {
      id: 3,
      name: 'AVAX',
      address: '0x06d2984c17B7877389D9c9D17b7665d58590EC1c'
    },
    {
      id: 4,
      name: 'DAI',
      address: '0x0fD0Cff56bB0dab27ea40F44B39D231f1e67E4E7'
    }
  ],
  // tokenMe: {
  //   id: 1,
  //   name: 'USDT',
  //   address: '0x7db03a15Aa2A1Cd87034FE2E9e08D2e422f51c9A'
  // },
  // tokenGet: {
  //   id: 2,
  //   name: 'SOL',
  //   address: '0x7740B7a39AED690075E05a5335fcC7C2D6E04311'
  // },
  tokenMe: {
    id: 3,
    name: 'AVAX',
    address: '0x06d2984c17B7877389D9c9D17b7665d58590EC1c'
  },
  tokenGet: {
    id: 4,
    name: 'DAI',
    address: '0x0fD0Cff56bB0dab27ea40F44B39D231f1e67E4E7'
  },
}

const enumTypeTokenList = {
  1: 'tokenMe',
  2: 'tokenGet'
}

const SET_TOKEN_FOR_SWAP = 'SET_TOKEN_FOR_SWAP'

export const tokens = (state = initState, action) => {
  switch (action.type) {
    case SET_TOKEN_FOR_SWAP: return {
      ...state,
      [enumTypeTokenList[action.typeToken]]: state.tokens.find(i => i.id === action.tokenId) ?? state[enumTypeTokenList[action.typeToken]]
    }

    default: return state;
  }
}

export const setTokenForSwap = (data) => ({type: SET_TOKEN_FOR_SWAP, ...data})
