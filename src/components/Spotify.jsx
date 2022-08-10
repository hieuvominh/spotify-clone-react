import React, { useEffect } from "react";
import styled from "styled-components";
import Body from "./Body";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";

function Spotify() {
  const [{ token }, dispatch] = useStateProvider();

  useEffect(() => {
    const getUserData = async () => {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const { data } = response;
      const user = {
        userId: data.id,
        userName: data.display_name,
      };

      dispatch({ type: "SET_USER", user });
    };
    getUserData();
  }, [token, dispatch]);

  return (
    <Container>
      <div className="spotify_body">
        <Sidebar />
        <div className="body">
          <Navbar />
          <div className="body_contents">
            <Body />
          </div>
        </div>
      </div>
      <div className="spotify_footer">
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
    }
  }
`;
