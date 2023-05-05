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
  where,
} from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const tempUid = "XWbtx7l5njceLoy5XHrS7ESwTRU2";

  const queryReactPost = async () => {
    try {
      const docRef = doc(db, "userReactPosts", tempUid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        try {
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
        } catch (error) {}
      } else {
        setReactPosts(undefined);
      }
      isFirstFetchPostsDone === false && firstQueryPosts();
    } catch (error) {}
  };

  // FIRST QUERY POSTS
  const firstQueryPosts = async () => {
    try {
      const arrOfId: Array<string> = [];
      const queryTask = query(
        collection(db, "searchPosts"),
        where("accessAllowed", "array-contains-any", [tempUid]),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const documentSnapshots = await getDocs(queryTask);
      documentSnapshots.forEach((post) => {
        arrOfId.push(post.id);
      });
      getDataPosts(arrOfId);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
    } catch (error) {
      console.log(error);
    }
  };

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

  //GET POSTS DATA
  const getDataPosts = async (idPostsArr: Array<string>) => {
    try {
      const queryPosts = query(
        collection(db, "posts"),
        where("idPost", "in", idPostsArr),
        orderBy("createdAt", "desc")
      );
      const documentSnapshots = await getDocs(queryPosts);
      const tempPosts = new Set(posts);
      documentSnapshots.forEach((post) => {
        const tempPost = createPostObject(post);
        tempPosts.add(tempPost);
      });
      setPosts(Array.from(tempPosts));
      isFirstFetchPostsDone === false && setIsFirstFetchPostsDone(true);
    } catch (error) {
      console.log(error);
    }
  };

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
