import React, { useEffect } from "react";
import UserCard from "../components/UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../app/feedSlice";

const Feed = () => {
  const dispatch = useDispatch();
  const feedItems = useSelector((state) => state.feed.items);
  const fetchFeed = async () => {
    if (feedItems.length > 0) return;
    try {
      const feedResponse = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      // console.log(feedResponse);

      dispatch(addFeed(feedResponse.data.apiResult));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);
  return (
    <div>
      {feedItems.length > 0 ? (
        // feedItems.map((user)=>{
        //   return <UserCard user={user} key={user._id} />
        // })
        <UserCard user={feedItems[0]} key={feedItems[0]._id} />
      ) : (
        <p className="my-10 text-center text-lg">No users found.</p>
      )}
    </div>
  );
};

export default Feed;
