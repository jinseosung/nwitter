import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({ userObj, isLoggedIn }) => {
  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path={`${process.env.PUBLIC_URL}/`}
              element={<Home userObj={userObj} />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/profile`}
              element={<Profile />}
            />
          </>
        ) : (
          <Route path={`${process.env.PUBLIC_URL}/`} element={<Auth />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
