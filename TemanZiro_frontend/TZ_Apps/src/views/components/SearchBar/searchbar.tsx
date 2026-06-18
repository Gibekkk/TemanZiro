import React from "react";
// Import icon langsung di dalam komponen ini agar rapi
import IconSearch from "@/assets/icon/searchorange.svg"; 
import style from "./searchbar.module.css"; 

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ 
  placeholder = "Cari Percakapan", 
  value, 
  onChange 
}: SearchBarProps) {
  return (
    <div className={style.searchBar}>
      <img src={IconSearch} alt="Search Icon" className={style.searchIcon} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={style.searchInput}
      />
    </div>
  );
}