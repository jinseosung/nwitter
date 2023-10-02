import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Voulez-vous supprimer ce nweet ?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.fileUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewNweet(value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({ text: newNweet });
    toggleEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Modifiez votre nweet"
              value={newNweet}
              onChange={onChange}
              type="text"
              required
            />
            <button onClick={toggleEditing}>Annuler</button>
            <input type="submit" value="Modifier" />
          </form>
        </>
      ) : (
        <>
          {nweetObj.fileUrl && (
            <img src={nweetObj.fileUrl} alt={nweetObj.text} />
          )}
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Supprimer</button>
              <button onClick={toggleEditing}>Modifier</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
