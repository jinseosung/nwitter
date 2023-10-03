import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  padding-bottom: 2.3em;
  width: 100%;
  gap: 0.8em;
`;

const Input = styled.input`
  width: 100%;
`;

const SubmitInput = styled.input`
  width: 100%;
  background-color: #00acee;
  color: white;
`;

const LogOutBtn = styled.button`
  margin-top: 3.7em;
  background-color: tomato;
`;

const Profile = ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };
  useEffect(() => {
    const getMyNweets = async () => {
      const myNweets = await dbService
        .collection("nweets")
        .where("creatorId", "==", userObj.uid)
        .orderBy("createdAt")
        .get();
      const myNweetsList = myNweets.docs.map((doc) => doc.data());
      console.log(myNweetsList);
    };
    getMyNweets();
  });

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newDisplayName !== userObj.displayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Input
          value={newDisplayName}
          onChange={onChange}
          type="text"
          placeholder="Ecrivez nouveau nom du profile"
        />
        <SubmitInput type="submit" value="Modifier mon profile" />
      </Form>
      <LogOutBtn onClick={onLogOutClick}>Se déconnecter</LogOutBtn>
    </>
  );
};

export default Profile;
