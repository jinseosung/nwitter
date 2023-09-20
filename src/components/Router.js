import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import Auth from "../routes/Auth";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {isLoggedIn ? (
          <Route path={`${process.env.PUBLIC_URL}/`} element={<Home />} />
        ) : (
          <Route path={`${process.env.PUBLIC_URL}/`} element={<Auth />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
