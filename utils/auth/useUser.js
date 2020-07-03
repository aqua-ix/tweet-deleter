import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import initFirebase from "./initFirebase";

initFirebase();

const useUser = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        cookies.remove("auth");
        router.push("/");
        router.reload();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const create = (user) => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        exclude_tweets: "",
        is_enable: true,
        params: "",
        time: "",
      })
      .then(() => console.log("User created"))
      .catch((error) => alert(`エラーが発生しました: ${error}`));
  };

  useEffect(() => {
    const cookie = cookies.get("auth");
    if (!cookie) {
      router.push("/");
      return;
    }
    firebase.auth().onAuthStateChanged((user) => {
      // TODO すでにユーザー作成されているかに応じて条件分岐
      create(user);
    });
    setUser(JSON.parse(cookie));
  }, []);

  return { user, logout };
};

export { useUser };
