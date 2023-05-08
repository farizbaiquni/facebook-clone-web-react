import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { createRef, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { postType, reactTypeOption } from "../../constants/EntityType";
import PostCard from "./PostCard";
import { db } from "../../lib/firebase";
import { reactPostsType } from "../../constants/PostComponentType";

export default function Post() {
  console.log("====== RE-RENDER POST ======");

  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState<Array<postType>>([]);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData> | null | undefined
  >(null);
  const [reactPosts, setReactPosts] = useState<reactPostsType | null | undefined>(null);
  const [isFirstFetchPostsDone, setIsFirstFetchPostsDone] = useState(false);
  const [errorFetch, setErrorFetch] = useState(false);
  const [fetchOnProgress, setFetchOnProgress] = useState(false);
  const tempUid = "XWbtx7l5njceLoy5XHrS7ESwTRU2";

  const createPostObject = (post: QueryDocumentSnapshot<DocumentData>): postType => {
    let tempPost = {
      idPost: post.data().idPost,
      idUser: post.data().idUser,
      textPost: post.data().textPost,
      feeling: post.data().feeling,
      location: post.data().location,
      tagTotal: post.data().tagTotal ? Number(post.data().tagTotal.toString()) : 0,
      shareTotal: post.data().shareTotal ? Number(post.data().shareTotal.toString()) : 0,
      commentTotal: post.data().commentTotal ? Number(post.data().commentTotal.toString()) : 0,
      createdAt: post.data().createdAt ? post.data().createdAt.toDate() : null,
      contentType: post.data().contentType,
      contentAttachment: post.data().contentAttachment,
      accessType: post.data().accessType,
      reactTotalLike: post.data().reactTotalLike
        ? parseInt(post.data().reactTotalLike.toString())
        : 0,
      reactTotalLove: post.data().reactTotalLove
        ? parseInt(post.data().reactTotalLove.toString())
        : 0,
      reactTotalCare: post.data().reactTotalCare
        ? parseInt(post.data().reactTotalCare.toString())
        : 0,
      reactTotalHaha: post.data().reactTotalHaha
        ? parseInt(post.data().reactTotalHaha.toString())
        : 0,
      reactTotalWow: post.data().reactTotalWow ? parseInt(post.data().reactTotalWow.toString()) : 0,
      reactTotalSad: post.data().reactTotalSad ? parseInt(post.data().reactTotalSad.toString()) : 0,
      reactTotalAngry: post.data().reactTotalAngry
        ? parseInt(post.data().reactTotalAngry.toString())
        : 0,
    };
    return tempPost;
  };

  const queryReactPost = async () => {
    try {
      setErrorFetch(false);
      setFetchOnProgress(true);
      const docRef = doc(db, "userReactPosts", tempUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tempObj = {
          like: docSnap.data().like,
          love: docSnap.data().love,
          care: docSnap.data().care,
          haha: docSnap.data().haha,
          wow: docSnap.data().wow,
          sad: docSnap.data().sad,
          angry: docSnap.data().angry,
        };
        setReactPosts(tempObj);
      } else {
        setReactPosts(undefined);
      }
      isFirstFetchPostsDone === false && firstQueryPosts();
    } catch (error) {
      setErrorFetch(true);
      setFetchOnProgress(false);
    }
  };

  // FIRST QUERY POSTS
  const firstQueryPosts = async () => {
    try {
      setErrorFetch(false);
      setFetchOnProgress(true);
      const arrOfId: Array<string> = [];
      const queryTask = query(
        collection(db, "searchPosts"),
        where("accessAllowed", "array-contains-any", [tempUid]),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const documentSnapshots = await getDocs(queryTask);
      documentSnapshots.forEach((post) => {
        arrOfId.push(post.id);
      });
      getDataPosts(arrOfId);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (error) {
      setErrorFetch(true);
      setFetchOnProgress(false);
    }
  };

  // NEXT QUERY POSTS
  const nextQueryPosts = async () => {
    try {
      setErrorFetch(false);
      setFetchOnProgress(true);
      const arrOfId: Array<string> = [];
      const queryTask = query(
        collection(db, "searchPosts"),
        where("accessAllowed", "array-contains-any", [tempUid]),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(1)
      );
      const documentSnapshots = await getDocs(queryTask);
      documentSnapshots.forEach((post) => {
        arrOfId.push(post.id);
      });
      getDataPosts(arrOfId);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      setFetchOnProgress(false);
    } catch (error) {
      console.log(error);
    }
  };

  //GET POSTS DATA
  const getDataPosts = async (idPostsArr: Array<string>) => {
    try {
      setErrorFetch(false);
      setFetchOnProgress(true);
      const queryPosts = query(
        collection(db, "posts"),
        where("idPost", "in", idPostsArr),
        orderBy("createdAt", "desc")
      );
      const documentSnapshots = await getDocs(queryPosts);
      const tempPosts: Array<postType> = [];
      documentSnapshots.forEach((post) => {
        const tempPost = createPostObject(post);
        tempPosts.push(tempPost);
      });
      setPosts((prevState) => [...prevState, ...tempPosts]);
      isFirstFetchPostsDone === false && setIsFirstFetchPostsDone(true);
      setFetchOnProgress(false);
    } catch (error) {
      setErrorFetch(true);
      setFetchOnProgress(false);
    }
  };

  const checkEndScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTop >= documentHeight - windowHeight) {
      !fetchOnProgress && isFirstFetchPostsDone && nextQueryPosts();
    }
  }, [fetchOnProgress, isFirstFetchPostsDone]);

  useEffect(() => {
    window.addEventListener("scroll", checkEndScroll);
    return () => {
      window.removeEventListener("scroll", checkEndScroll);
    };
  }, [checkEndScroll]);

  useEffect(() => {
    if (auth !== null && auth !== undefined) {
      queryReactPost();
    }
  }, [auth]);

  return (
    <div>
      {posts.map((post) => {
        return (
          <PostCard key={post.idPost} post={post} userId={auth!!.uid!!} reactPosts={reactPosts} />
        );
      })}
    </div>
  );
}
