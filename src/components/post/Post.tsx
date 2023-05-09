import {
  collection,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { postType } from "../../constants/EntityType";
import PostCard from "./PostCard";
import { db } from "../../lib/firebase";

export default function Post() {
  console.log("====== RE-RENDER POST ======");

  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState<Array<postType>>([]);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData> | null | undefined
  >(null);
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
      reactTotalLike: post.data().reactTotalLike ?? 0,
      reactTotalLove: post.data().reactTotalLove ?? 0,
      reactTotalCare: post.data().reactTotalCare ?? 0,
      reactTotalHaha: post.data().reactTotalHaha ?? 0,
      reactTotalWow: post.data().reactTotalWow ?? 0,
      reactTotalSad: post.data().reactTotalSad ?? 0,
      reactTotalAngry: post.data().reactTotalAngry ?? 0,
      reactTotal:
        (post.data().reactTotalLike ?? 0) +
        (post.data().reactTotalLove ?? 0) +
        (post.data().reactTotalCare ?? 0) +
        (post.data().reactTotalHaha ?? 0) +
        (post.data().reactTotalWow ?? 0) +
        (post.data().reactTotalSad ?? 0) +
        (post.data().reactTotalAngry ?? 0),
    };
    return tempPost;
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
    // window.addEventListener("scroll", checkEndScroll);
    // return () => {
    //   window.removeEventListener("scroll", checkEndScroll);
    // };
  }, [checkEndScroll]);

  useEffect(() => {
    if (auth !== null && auth !== undefined) {
      !isFirstFetchPostsDone && firstQueryPosts();
    }
  }, [auth]);

  return (
    <div>
      {posts.map((post) => {
        return <PostCard key={post.idPost} post={post} userId={auth!!.uid!!} />;
      })}
    </div>
  );
}
