import React, { useEffect, useState } from "react";
import { dbService } from "fbase";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState("");

  useEffect(() => {
    const getNweets = async () => {
      const dbNweets = await dbService.collection("nweets").get();
      dbNweets.forEach((doc) => {
        const nweetObject = {
          ...doc.data(),
          id: doc.id,
        };
        setNweets((prev) => [nweetObject, ...prev]);
      });
    };
    getNweets();
    dbService.collection("nweets").onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.collection("nweets").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="Dis-moi tout"
          maxLength={120}
        />
        <input type="submit" value="Ntweet" />
      </form>
      <div>
        {nweets &&
          nweets.map((nweet) => (
            <div key={nweet.id}>
              <h4>{nweet.text}</h4>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
