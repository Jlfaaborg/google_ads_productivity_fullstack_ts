import React, { useEffect, useRef } from "react";
import { useSelector, } from "react-redux";
import { RootState, useAppDispatch } from "./redux/store";
import "./css/Auth.css"


const Auth = () => {
  const dispatch = useAppDispatch();

  const isLoggedIn = useSelector((state: RootState) => state.dashboard.isLoggedIn);
  const hasTokens = useRef(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const expirationDate = newExpirationDate();

    if (accessToken && refreshToken) {
      sessionStorage.setItem("accessToken", accessToken);
      sessionStorage.setItem("refreshToken", refreshToken);
      sessionStorage.setItem("expirationDate", expirationDate.toDateString());
      hasTokens.current = true;
      dispatch({ type: "dashboard/logged", payload: true });
      window.history.replaceState({}, document.title, "/");
    }

  });

  const createGoogleAuthLink = async () => {
    const request = await fetch("/auth", {
      method: "POST",
    });
    const response = await request.json().then(res => {
      return res
    }).catch(err => {
      console.error(err);
    });

    window.location.href = response.url;
  };

  const newExpirationDate = () => {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  const signOut = () => {
    hasTokens.current = false;

    dispatch({ type: "dashboard/logged", payload: false });
  };

  return (
    <div className="Auth">
      {!(isLoggedIn && hasTokens) ? (
        <button onClick={createGoogleAuthLink}>Login</button>
      ) : (
        <>
          <button onClick={signOut}>Sign Out</button>
        </>
      )}
    </div>
  );
};
export default Auth;
