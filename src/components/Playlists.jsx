/** @format */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ActionTypes } from '../utils/actionTypes';
import { useStateProvider } from '../utils/StateProvider';

function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();

  useEffect(() => {
    const getPlaylistsData = async () => {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/playlists',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const { items } = response.data;
      console.log(items);
      const playlists = items.map((playlist) => {
        return { name: playlist.name, url: playlist.name, id: playlist.id };
      });
      dispatch({ type: ActionTypes.SET_PLAYLISTS, playlists });
    };
    getPlaylistsData();
  }, [token, dispatch]);

  const changePlaylist = (selectedPlaylistId) => {
    dispatch({ type: ActionTypes.SET_PLAYLIST_ID, selectedPlaylistId });
  };

  return (
    <Container>
      <ul>
        {playlists?.map((playlist) => {
          return (
            <li onClick={() => changePlaylist(playlist.id)} key={playlist.id}>
              {playlist.name}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

export default Playlists;

const Container = styled.div`
	height: 100%;
	overflow: hidden;
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      height: 50vh;
      max-height: 100%;
      overflow: auto;
	    &::-webkit-scrollbar {
        width: 0.7rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
	    }
      li {
        display: flex;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white;
        }
      }
    }
  }
`;
