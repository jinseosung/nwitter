import React from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "fbase";

const Profile = () => {
  const navigate = useNavigate();

  const onLogOutClick = async () => {
    await authService.signOut();
    navigate("/");
  };

  return (
    <>
      <button onClick={onLogOutClick}>Se déconnecter</button>
    </>
  );
};

export default Profile;
