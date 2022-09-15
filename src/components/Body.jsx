/** @format */

import React, { useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { AiFillClockCircle } from 'react-icons/ai';
import { useStateProvider } from '../utils/StateProvider';
import { ActionTypes } from '../utils/actionTypes';

function Body({ headerBackGround }) {
  const [
    { token, selectedPlaylistId, selectedPlaylist },
    dispatch,
  ] = useStateProvider();

  const msToMinSec = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);

    return min + ':' + (sec < 10 ? '0' : '') + sec;
  };

  useEffect(() => {
    const getInitialPlaylist = async () => {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const selectedPlaylist = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description.startsWith('<a')
          ? ''
          : response.data.description,
        image: response.data.images[0].url,
        tracks: response.data.tracks.items.map(({ track }) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          image: track.album.images[2].url,
          duration: track.duration_ms,
          album: track.album.name,
          context_uri: track.album.uri,
          track_number: track.track_number,
        })),
      };
      dispatch({ type: ActionTypes.SET_PLAYLIST, selectedPlaylist });
    };
    getInitialPlaylist();
  }, [token, dispatch, selectedPlaylistId]);

  const playTrack = async (
    id,
    name,
    artists,
    image,
    context_uri,
    track_number
  ) => {
    const response = await axios.put(
      `https://api.spotify.com/v1/me/player/play`,
      {
        context_uri,
        offet: {
          position: track_number - 1,
        },
        position_ms: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 204) {
      const currentPlaying = {
        id,
        name,
        artists,
        image,
      };
      dispatch({ type: ActionTypes.SET_PLAYING, currentPlaying });
      dispatch({ type: ActionTypes.SET_PLAYER_STATE, playerState: true });
    } else {
      dispatch({ type: ActionTypes.SET_PLAYER_STATE, playerState: true });
    }
  };

  return (
    <Container headerBackGround={headerBackGround}>
      {selectedPlaylist ? (
        <>
          <div className='playlist'>
            <div className='image'>
              <img src={selectedPlaylist.image} alt='image' />
            </div>
            <div className='details'>
              <span className='type'>PLAYLIST</span>
              <h1 className='title'>{selectedPlaylist.name}</h1>
              <p className='description'>{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className='list'>
            <div className='header_row'>
              <div className='col'>
                <span>#</span>
              </div>
              <div className='col'>
                <span>TITLE</span>
              </div>
              <div className='col'>
                <span>ALBUM</span>
              </div>{' '}
              <div className='col'>
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className='tracks'>
              {selectedPlaylist.tracks.map((track, index) => {
                return (
                  <div
                    className='row'
                    key={track.id}
                    onClick={() =>
                      playTrack(
                        track.id,
                        track.name,
                        track.artists,
                        track.image,
                        track.context_uri
                      )
                    }>
                    <div className='col'>
                      <span>{index + 1}</span>
                    </div>
                    <div className='col detail'>
                      <div className='image'>
                        <img src={track.image} alt='image' />
                      </div>
                      <div className='info'>
                        <span className='name'>{track.name}</span>
                        <span>{track.artists}</span>
                      </div>
                    </div>
                    <div className='col'>
                      <span>{track.album}</span>
                    </div>
                    <div className='col'>
                      <span>{msToMinSec(track.duration)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </Container>
  );
}

export default Body;

const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header_row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      color: #dddcdc;
      margin: 1rem 0 0 0;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ navBackGround }) =>
        navBackGround ? '#000000dc' : 'none'};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 1.9fr 0.1fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          .img {
            height: 40px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;
