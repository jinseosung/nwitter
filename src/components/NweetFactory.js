import { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({ userObj }) => {
  const [url, setUrl] = useState("");
  const [nweet, setNweet] = useState("");
  const [fileName, setFileName] = useState("");

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
  );
};

export default NweetFactory;
