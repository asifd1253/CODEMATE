import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import { Provider } from "react-redux";
import store from "./app/store";
import Feed from "./pages/Feed";
import Settings from "./pages/Settings";
import ResetPassword from "./components/ResetPassword";
import EditProfile from "./components/EditProfile";
import MyNetwork from "./pages/MyNetwork";
import SignUp from "./pages/SignUp";
import MyRequests from "./pages/MyRequests";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/network" element={<MyNetwork />} />
              <Route path="/requests" element={<MyRequests />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};

export default App;
