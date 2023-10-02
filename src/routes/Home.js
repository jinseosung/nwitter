import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [url, setUrl] = useState("");
  const [fileName, setFileName] = useState("");

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
    let fileUrl = "";
    if (url !== "") {
      const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await fileRef.putString(url, "data_url");
      fileUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setUrl("");
    setFileName("");
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (fin) => {
      const {
        currentTarget: { result },
      } = fin;
      setUrl(result);
    };
    setUrl(reader.readAsDataURL(file));
    setFileName(file);
  };

  const onClearUrl = (e) => {
    setUrl("");
    setFileName("");
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
        <input onChange={onFileChange} type="file" accept="image/*" />
        <img src={url} alt={fileName} />
        <input type="submit" value="Ntweet" />
        {url && <button onClick={onClearUrl}>Annuler</button>}
      </form>
      <div>
        {nweets &&
          nweets.map((nweet) => (
            <Nweet
              key={nweet.id}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid ? true : false}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
