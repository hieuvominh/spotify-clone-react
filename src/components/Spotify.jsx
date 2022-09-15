/** @format */

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Body from './Body';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import axios from 'axios';
import { useStateProvider } from '../utils/StateProvider';
import { ActionTypes } from '../utils/actionTypes';

function Spotify() {
  const [{ token }, dispatch] = useStateProvider();
  const bodyRef = useRef();
  const [navBackGround, setNavBackGround] = useState(false);
  const [headerBackGround, setHeaderBackGround] = useState(false);

  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackGround(true)
      : setNavBackGround(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackGround(true)
      : setHeaderBackGround(false);
  };

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const { data } = response;
      const user = {
        userId: data.id,
        userName: data.display_name,
      };

      dispatch({ type: ActionTypes.SET_USER, user });
    };
    getUserData();
  }, [token, dispatch]);

  return (
    <Container>
      <div className='spotify_body'>
        <Sidebar />
        <div className='body' ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackGround={navBackGround} />
          <div className='body_contents'>
            <Body headerBackGround={headerBackGround} />
          </div>
        </div>
      </div>
      <div className='spotify_footer'>
        <Footer />
      </div>
    </Container>
  );
}

export default Spotify;

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;

  .spotify_body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 87, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;
