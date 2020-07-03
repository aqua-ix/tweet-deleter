import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import cookie from "js-cookie";
import initFirebase from "../utils/auth/initFirebase";

// Init the Firebase app.
initFirebase();

const firebaseAuthConfig = {
  signInFlow: "redirect",
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: "/",
  credentialHelper: "none",
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      // xa is the access token, which can be retrieved through
      // firebase.auth().currentUser.getIdToken()
      const { uid, email, xa } = user;
      const userData = {
        id: uid,
        email,
        token: xa,
      };

      cookie.set("auth", userData, {
        expires: 1,
      });
    },
  },
};

const FirebaseAuth = () => {
  // Do not SSR FirebaseUI, because it is not supported.
  // https://github.com/firebase/firebaseui-web/issues/213
  const [renderAuth, setRenderAuth] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(firebase.auth());
      if (firebase.auth().currentUser) {
        const db = firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid);
        db.set({
          exclude_tweets: "",
          is_enable: true,
          params: "",
          time: "",
        })
          .then(() => setRenderAuth(true))
          .catch((error) => alert(`エラーが発生しました: ${error}`));
      } else {
        setRenderAuth(true);
      }
    }
  }, []);
  return (
    <div>
      {renderAuth ? (
        <StyledFirebaseAuth
          uiConfig={firebaseAuthConfig}
          firebaseAuth={firebase.auth()}
        />
      ) : null}
    </div>
  );
};

export default FirebaseAuth;
