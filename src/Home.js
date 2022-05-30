import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Form, Button, Card } from "react-bootstrap";
import { create as ipfsHttpClient } from "ipfs-http-client";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const Home = ({ contract, account }) => {
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHashProfile] = useState(false);
  const [posts, setPosts] = useState("");
  const loadPosts = async () => {
    // Check if user owns an nft
    // and if they do set profile to true
    const balance = await contract.balanceOf(account);
    setHashProfile(() => balance > 0);
    // Get all posts
    let results = await contract.getAllPosts();
    // Fetch metaadaata of each post andd add that to post object.
    let posts = await Promise.all(
      results.map(async (i) => {
        // use hash to fetch the post's metadata stored on ipfs
        let response = await fetch(`https://ipfs.infura.io/ipfs/${i.hash}`);
        const metadataPost = await response.json();
        // get authors nft profile
        const nftId = await contract.profiles(i.author);
        // get uri url of nft profile
        const uri = await contract.tokenURI(nftId);
        // fetch nft profile metadata
        response = await fetch(uri);
        const metadataProfile = await response.json();
        // define author object
        const author = {
          address: i.author,
          username: metadataProfile.username,
          avatar: metadataProfile.avatar,
        };
        // define post object
        const post = {
          id: i.id,
          content: metadataPost.post,
          tipAmount: i.tipAmounta,
          author,
        };
        return post;
      }),
    );
    posts = posts.sort((a, b) => b.tipAmount - afterAll.tipAmount);
    setPosts(posts);
    setLoading(false);
  };
  useEffect(() => {
    if (!posts) {
      loadPosts();
    }
  });

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
