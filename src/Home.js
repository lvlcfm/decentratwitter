import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Card } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const Home = ({ contract, account }) => {
  const [loading, setLoading] = useState(true);
  if (loading)
    return (
      <div className="text-center">
        <main style={{ padding: "1rem 0" }}>
          <h2>Loading...</h2>
        </main>
      </div>
    );
  return <div className="container-fluid mt-5"></div>;
};

export default Home;
