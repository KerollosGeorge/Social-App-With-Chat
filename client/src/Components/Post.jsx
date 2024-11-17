import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import moment from "moment";
import { Comments } from "./Comments";
import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import { AuthContext } from "../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { ShareTo } from "./ShareTo";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import EditPost from "./EditPost";

export const Post = ({ post }) => {
  const [openComments, setOpenComments] = useState(false);
  const [share, setShare] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const ref = useRef(null);
  const moreOptionsRef = useRef(null);
  useEffect(
    (event) => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setShare(false);
        }
      };
      window.addEventListener("click", handleClickOutside);
    },
    [ref]
  );
  useEffect(
    (event) => {
      const handleClickOutside = (event) => {
        if (
          moreOptionsRef.current &&
          !moreOptionsRef.current.contains(event.target)
        ) {
          setMoreOptions(false);
        }
      };
      window.addEventListener("click", handleClickOutside);
    },
    [moreOptionsRef]
  );
  const { isLoading, data, error } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`likes?postId=${post.id}`);
      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) {
        return makeRequest.delete(`likes?postId=${post.id}`);
      }
      return makeRequest.post(`likes`, { postId: post.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  const handleLike = () => {
    mutation.mutate(data.includes(user.id));
  };

  const {
    isLoading: commentLoading,
    error: commentError,
    data: commentData,
  } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      const res = await makeRequest.get(`comments?postId=${post.id}`);
      return res.data;
    },
  });
  const handleDelete = async () => {
    try {
      // Delete post
      const res = await makeRequest.delete(`posts?postId=${post.id}`);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      }, [2000]);
    } catch (error) {
      toast.error("An error occurred while deleting the post.");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="relative w-full shadow-md shadow-[gray] p-5 rounded-lg flex flex-col gap-4">
      <div className=" w-full flex justify-between">
        <div className=" flex gap-2 items-center">
          <img
            src={`/personalImages/${post.profilePic}`}
            className="size-[50px] rounded-full bg-slate-400"
          />
          <div className=" w-full flex flex-col items-start">
            <h2
              className="text-lg font-bold cursor-pointer"
              onClick={() => navigate(`/profile/${post.userId}`)}
            >
              {post.username}
            </h2>
            <span>{moment(post.createdAt).fromNow()}</span>
          </div>
        </div>

        {user.id == post.userId && (
          <div
            onClick={() => setMoreOptions(!moreOptions)}
            className=" relative "
            ref={moreOptionsRef}
          >
            <div className="cursor-pointer hover:scale-[1.3] transition-all ">
              <MoreHorizIcon />
            </div>
            {moreOptions && (
              <div className="absolute top-5 left-[-100%] right-0  flex flex-col justify-center items-start gap-1  w-max p-2">
                <button
                  className=" hover:bg-[blue] hover:scale-[1.1] border-[1px] transition-all w-[70px] border-[blue] border-dashed text-lg rounded-md"
                  onClick={() => setEditPost(true)}
                >
                  Edit
                </button>
                <button
                  className=" hover:bg-[red] hover:scale-[1.1] border-[1px] transition-all w-[70px] border-[red] border-dashed text-lg rounded-md"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="w-full flex flex-wrap">{post.content}</p>
      <img className="w-full h-[350px]" src={`./upload/${post.img}`} />
      {editPost && (
        <div className="absolute p-3 top-0 bottom-0 left-0 right-0 m-auto z-50 bg-[#2e2e2e] rounded-md w-full h-max">
          {" "}
          <EditPost data={post} setEditPost={setEditPost} />
        </div>
      )}
      <div className="flex gap-4">
        <span
          className="flex items-center gap-2 cursor-pointer hover:scale-[1.05] transition-all hover:transition-all"
          onClick={handleLike}
        >
          {data && data.includes(user.id) ? (
            <FontAwesomeIcon
              icon={faHeart}
              className="text-red-500  scale-[1.4]"
            />
          ) : (
            <FontAwesomeIcon icon={faHeart} className="scale-[1.4]" />
          )}
          <p>{data?.length} Likes</p>
        </span>
        <span
          className="flex items-center gap-2 cursor-pointer hover:scale-[1.05] transition-all hover:transition-all"
          onClick={() => setOpenComments(!openComments)}
        >
          <TextsmsOutlinedIcon />
          <p> {commentData?.length > 0 ? commentData.length : 0} Comments</p>
        </span>
        <div className=" relative flex flex-1">
          <span
            className="flex gap-2 cursor-pointer hover:scale-[1.05] transition-all hover:transition-all"
            onClick={() => setShare(!share)}
            ref={ref}
          >
            <ShareOutlinedIcon />
            <p>Share</p>
          </span>
          {share && (
            <div className=" absolute w-full bottom-9 flex gap-4">
              <ShareTo post={post} />
            </div>
          )}
        </div>
      </div>
      {openComments && <Comments post={post} />}
    </div>
  );
};
