import React, { useState } from "react";
import { RightSidebar } from "../Components/RightSidebar";
import { LeftSidebar } from "../Components/LeftSidebar";
import { Stories } from "../Components/Stories";
import { Share } from "../Components/Share";
import { Posts } from "../Components/Posts";
import { Navbar } from "../Components/Navbar";
import { Footer } from "../Components/Footer";

export const Home = () => {
  const [search, setSearch] = useState("");
  return (
    <div className=" w-full flex flex-col">
      <Navbar search={search} setSearch={setSearch} />
      <div className="w-full grid grid-cols-4 text-center mt-5 gap-5 max-md:flex max-md:flex-col min-w-[500px]">
        <LeftSidebar />
        <div className="w-full flex justify-center flex-col gap-5 col-span-2">
          <Stories />
          <Share />
          <Posts search={search} />
        </div>

        <RightSidebar />
      </div>
      <Footer />
    </div>
  );
};
