/** @format */
import { ActionTypes } from './actionTypes';
export const initialState = {
  token: null,
  playlists: [],
  user: null,
  selectedPlaylistId: '7bxaMSkxXKF5wjEnN7iQBY',
  selectedPlaylist: null,
  currentPlaying: null,
  playerState: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN: {
      return {
        ...state,
        token: action.token,
      };
    }
    case ActionTypes.SET_PLAYLISTS: {
      return {
        ...state,
        playlists: action.playlists,
      };
    }
    case ActionTypes.SET_USER: {
      return {
        ...state,
        user: action.user,
      };
    }
    case ActionTypes.SET_PLAYLIST: {
      return {
        ...state,
        selectedPlaylist: action.selectedPlaylist,
      };
    }
    case ActionTypes.SET_PLAYING: {
      return {
        ...state,
        currentPlaying: action.currentPlaying,
      };
    }
    case ActionTypes.SET_PLAYER_STATE: {
      return {
        ...state,
        playerState: action.playerState,
      };
    }
    case ActionTypes.SET_PLAYLIST_ID: {
      return {
        ...state,
        selectedPlaylistId: action.selectedPlaylistId,
      };
    }
    default:
      return state;
  }
};

export default reducer;
