import { dbService, storageService } from "fbase";
import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

const CancelBtn = styled.button`
  width: 100%;
  text-align: center;
  background-color: tomato;
  padding: 0.7em 1em;
  border-radius: 20px;
  margin: 1em auto;
`;

const EditInput = styled.input`
  width: 100%;
  padding: 1em;
`;

const SubmitInput = styled.input`
  width: 100%;
  background-color: #00acee;
  color: white;
`;

const NweetContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding: 1.5em;
  position: relative;
  margin-bottom: 1.5em;
`;

const NweetImg = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-right: 1.3em;
`;

const NweetText = styled.h4`
  color: black;
`;

const Btns = styled.div`
  display: flex;
  gap: 0.5em;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Btn = styled.button`
  width: inherit;
  text-align: center;
  padding: 0;
  background-color: transparent;
  border-radius: none;
  color: black;
`;

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Voulez-vous supprimer ce nweet ?");
    if (ok) {
      if (nweetObj.fileUrl) {
        await storageService.refFromURL(nweetObj.fileUrl).delete();
      }
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
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
            <EditInput
              placeholder="Modifiez votre nweet"
              value={newNweet}
              onChange={onChange}
              type="text"
              required
            />
            <CancelBtn onClick={toggleEditing}>Annuler</CancelBtn>
            <SubmitInput type="submit" value="Modifier" />
          </form>
        </>
      ) : (
        <NweetContainer>
          {nweetObj.fileUrl && (
            <NweetImg src={nweetObj.fileUrl} alt={nweetObj.text} />
          )}
          <NweetText>{nweetObj.text}</NweetText>
          {isOwner && (
            <Btns>
              <Btn onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </Btn>
              <Btn onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencil} />
              </Btn>
            </Btns>
          )}
        </NweetContainer>
      )}
    </div>
  );
};

export default Nweet;
