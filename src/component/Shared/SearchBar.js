import React, { useState } from "react";

const SearchBar = ({ placeholder, searchTerm, setSearchTerm }) => {

  return (
    <form  className="relative max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-2 py-1 border border-gray-300 rounded-full shadow-sm focus:outline-none  pr-10 "
        placeholder={placeholder || "Tìm kiếm..."}
      />
     
  <i className="fa-solid fa-magnifying-glass absolute inset-y-0 left-0 top-2 text-[24px] flex items-center pl-3"></i>
  <span className="absolute right-3 top-[10px] text-[12px] text-white w-[20px] h-[20px] flex items-center cursor-pointer  justify-center rounded-full bg-gray-500 "
        onClick={(e) => setSearchTerm("")}
        ><i class="fa-solid fa-x "></i></span>
    </form>
  );
};

export default SearchBar;
