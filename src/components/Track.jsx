/** @format */

import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useStateProvider } from '../utils/StateProvider';
import { ActionTypes } from '../utils/actionTypes';

function Track() {
  const [{ token, currentPlaying }, dispatch] = useStateProvider();

  useEffect(() => {
    const getCurrentTrack = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/player/currently-playing`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!!response.data) {
        const { item } = response.data;
        const currentPlaying = {
          id: item.id,
          name: item.name,
          artists: item.artists.map((artist) => artist.name),
          image: item.album.images[2].url,
        };
        console.log(currentPlaying);
        dispatch({ type: ActionTypes.SET_PLAYING, currentPlaying });
      }
    };
    getCurrentTrack();
  }, [token, dispatch]);

  console.log(currentPlaying);
  return (
    <Container>
      {currentPlaying ? (
        <div className='track'>
          <div className='track_image'>
            <img src={currentPlaying.image} alt='track image' />
          </div>
          <div className='track_info'>
            <h4>{currentPlaying.name}</h4>
            <h6>{currentPlaying.artists.join(', ')}</h6>
          </div>
        </div>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Track;

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &_info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      h4 {
        color: white;
      }
      h6 {
        color: #b3b3b3;
      }
    }
  }
`;
