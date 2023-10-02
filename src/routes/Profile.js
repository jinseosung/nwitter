import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";

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
      <form onSubmit={onSubmit}>
        <input
          value={newDisplayName}
          onChange={onChange}
          type="text"
          placeholder="Ecrivez nouveau nom du profile"
        />
        <input type="submit" value="Modifier mon profile" />
      </form>
      <button onClick={onLogOutClick}>Se déconnecter</button>
    </>
  );
};

export default Profile;
