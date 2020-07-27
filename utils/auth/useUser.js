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
        exclude_tweets: [],
        is_enable: false,
        params: [],
        start_time: "",
        end_time: "",
      })
      .then(() => {
        console.log("User created");
      })
      .catch((error) => alert(error));
  };

  const retrieve = (user) => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((res) => {
        if (res.exists) {
          console.log("User received");
          console.log(res.data());
          return res;
        } else {
          create(user);
        }
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    const cookie = cookies.get("auth");
    if (!cookie) {
      router.push("/");
      return;
    }
    firebase.auth().onAuthStateChanged((user) => {
      retrieve(user);
    });
    setUser(JSON.parse(cookie));
  }, []);

  return { user, logout };
};

export { useUser };
