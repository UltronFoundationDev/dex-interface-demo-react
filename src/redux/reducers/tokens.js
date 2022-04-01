const initState = {
  tokens: [
    {
      id: 2,
      name: 'bT',
      address: '0xe37c473B8fFD02D872030B890b33F31d2cC3908F'
    },
    {
      id: 1,
      name: 'cT',
      address: '0x0c3a3897e4ECB4115e26228A29b25dccC52a86aB'
    },
    {
      id: 3,
      name: 'carl1',
      address: '0x7F25F254765B95F4384B6e031ff975cA744f3212'
    },
    {
      id: 4,
      name: 'carl2',
      address: '0x10D16dE927529c9d63BFaE3A26612FC3746Eda11'
    }
  ],
  tokenMe: {
    id: 1,
    name: 'cT',
    address: '0x0c3a3897e4ECB4115e26228A29b25dccC52a86aB'
  },
  tokenGet: {
    id: 2,
    name: 'bT',
    address: '0xe37c473B8fFD02D872030B890b33F31d2cC3908F'
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
