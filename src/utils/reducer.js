export const initialState = {
  token: null,
  playlists: [],
  user: null,
  selectedPlaylist: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_TOKEN": {
      return {
        ...state,
        token: action.token,
      };
    }
    case "SET_PLAYLISTS": {
      return {
        ...state,
        playlists: action.playlists,
      };
    }
    case "SET_USER": {
      return {
        ...state,
        user: action.user,
      };
    }
    default:
      return state;
  }
};

export default reducer;
