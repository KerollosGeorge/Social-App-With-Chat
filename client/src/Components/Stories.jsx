import {
  faArrowLeft,
  faArrowRight,
  faChevronLeft,
  faChevronRight,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { makeRequest } from "../axios";

export const Stories = () => {
  const [file, setFile] = useState(null);
  const [start, setStart] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await makeRequest.get("stories");
      return res.data;
    },
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload/story", formData);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (story) => {
      return makeRequest.post("stories", story);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
  });

  const handleShareStory = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      imgUrl = await upload();
    }
    mutation.mutate({ img: imgUrl });
    setFile(null);
  };

  useEffect(() => {
    if (data && start >= data.length) {
      setStart(0);
    }
  }, [data, start]);

  const handleNext = () => {
    setStart((prevStart) => (prevStart + 1) % data.length);
  };

  const handlePrev = () => {
    setStart((prevStart) => (prevStart - 1 + data.length) % data.length);
  };

  const getVisibleStories = () => {
    if (!data) return [];
    const visibleStories = [];
    for (let i = 0; i < Math.min(data.length, 4); i++) {
      visibleStories.push(data[(start + i) % data.length]);
    }
    return visibleStories;
  };

  return (
    <div className="w-full relative min-h-[200px] shadow-md shadow-[gray] rounded-md h-max">
      <label htmlFor="story">
        <FontAwesomeIcon
          icon={faCirclePlus}
          className="size-8 absolute z-50 bottom-10 left-4 cursor-pointer hover:scale-[1.1] transition-all text-slate-200"
        />
      </label>
      <input
        type="file"
        id="story"
        onChange={handleFileChange}
        className="hidden"
      />
      {file && (
        <div className="absolute w-[500px] h-max top-[10%] z-50 shadow-md shadow-[gray] flex flex-col items-center bg-[#d9d9d9] p-5 gap-4">
          <img src={URL.createObjectURL(file)} alt="" className="h-[200px]" />
          <div className="w-full flex justify-around">
            <button
              className="btn btn-primary w-[150px] text-lg text-white"
              onClick={handleShareStory}
            >
              Share Story
            </button>
            <button
              className="btn btn-danger w-[150px] text-lg text-white"
              onClick={() => setFile(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-4 w-full h-[230px] items-center p-2 overflow-hidden">
        {isLoading ? (
          <div className="loading loading-spinner"></div>
        ) : (
          getVisibleStories().map((item, index) => (
            <div
              key={index}
              className="relative min-w-[25%] h-full shadow-md shadow-[gray] rounded-md"
            >
              <img
                src={`./stories/${item.img}`}
                alt=""
                className="w-full h-full rounded-md max-w-[200px]"
              />
              <span className="absolute bottom-2 left-2 w-full text-center text-xl text-slate-200">
                {item.username}
              </span>
            </div>
          ))
        )}
      </div>
      {data && data.length > 3 && (
        <div>
          <FontAwesomeIcon
            icon={faChevronLeft}
            onClick={handlePrev}
            className="absolute top-0 bottom-0 left-2 text-2xl m-auto text-slate-200 cursor-pointer hover:scale-[1.2] transition-all"
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            onClick={handleNext}
            className="absolute top-0 bottom-0 right-0 m-auto text-2xl text-slate-200 cursor-pointer hover:scale-[1.2] transition-all"
          />
        </div>
      )}
    </div>
  );
};
