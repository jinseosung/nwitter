import { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: relative;
  margin-bottom: 0.7em;
  width: 100%;
`;

const NweetInput = styled.input`
  flex-grow: 1;
  height: 40px;
  color: white;
  border: 1px solid #04aaff;
  font-weight: 500;
  background-color: transparent;
`;

const SubmitInput = styled.input`
  position: absolute;
  right: 0;
  background-color: #04aaff;
  height: 40px;
  width: 40px;
  text-align: center;
  border-radius: 20px;
  color: white;
  cursor: pointer;
`;

const Label = styled.label`
  color: #04aaff;
  display: flex;
  gap: 0.8em;
  margin-bottom: 1em;
`;

const FileInput = styled.input`
  display: none;
`;

const AttachImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const CancelBtn = styled.button`
  background-color: transparent;
  color: #04aaff;
  padding: 0.7em 1em;
  border-radius: none;
  display: flex;
  justify-content: center;
  gap: 0.7em;
`;

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
    <Form onSubmit={onSubmit}>
      <InputContainer>
        <NweetInput
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="Dis-moi tout"
          maxLength={120}
        />
        <SubmitInput type="submit" value="&rarr;" />
      </InputContainer>
      <Label htmlFor="attach-file">
        Ajouter photos
        <FontAwesomeIcon icon={faPlus} />
      </Label>
      <FileInput
        id="attach-file"
        onChange={onFileChange}
        type="file"
        accept="image/*"
      />
      {url && (
        <>
          <AttachImg src={url} alt={fileName} />
          <CancelBtn onClick={onClearUrl}>
            Annuler
            <FontAwesomeIcon icon={faX} />
          </CancelBtn>
        </>
      )}
    </Form>
  );
};

export default NweetFactory;
