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
    // <div className="flex flex-wrap justify-center gap-6">
    //   {feedItems.length > 0 ? (
    //     feedItems.map((user) => {
    //       return <UserCard key={user._id} user={user} />;
    //     })
    //   ) : (
    //     <p>Loading users...</p>
    //   )}
    // </div>
    <div className="flex min-h-screen items-center justify-center p-6">
      {feedItems.length > 0 ? (
        <div className="carousel w-full max-w-md rounded-box">
          {feedItems.map((user) => (
            <div key={user._id} className="carousel-item w-full">
              <UserCard user={user} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg">Loading users...</p>
      )}
    </div>
  );
};

export default Feed;
