/** @format */

import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from 'react-icons/bs';
import { CgPlayTrackNext, CgPlayTrackPrev } from 'react-icons/cg';
import { FiRepeat } from 'react-icons/fi';
import { useStateProvider } from '../utils/StateProvider';
import { ActionTypes } from '../utils/actionTypes';

function PlayerControl() {
  const [{ token, playerState }, dispatch] = useStateProvider();

  const changeTrack = async (type) => {
    await axios.post(
      `https://api.spotify.com/v1/me/player/${type}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
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
    } else {
      dispatch({ type: ActionTypes.SET_PLAYING, currentPlaying: null });
    }
  };

  const changeState = async () => {
    const state = playerState ? 'pause' : 'play';
    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/${state}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    dispatch({ type: ActionTypes.SET_PLAYER_STATE, playerState: !playerState });
  };

  return (
    <Container>
      <div className='shuffle'>
        <BsShuffle />
      </div>
      <div className='previous'>
        <CgPlayTrackPrev
          onClick={() => {
            changeTrack('previous');
          }}
        />
      </div>
      <div className='state'>
        {playerState ? (
          <BsFillPauseCircleFill onClick={changeState} />
        ) : (
          <BsFillPlayCircleFill onClick={changeState} />
        )}
      </div>
      <div className='next'>
        <CgPlayTrackNext
          onClick={() => {
            changeTrack('next');
          }}
        />
      </div>
      <div className='repeat'>
        <FiRepeat />
      </div>
    </Container>
  );
}

export default PlayerControl;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    &:hover {
      color: white;
    }
  }
  .state {
    svg {
      color: white;
    }
  }
  .previous,
  .next,
  .state {
    font-size: 2rem;
  }
`;
