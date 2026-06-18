import React from "react";
import styles from "./tag.module.css";

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export default function Tag({ children, className }: TagProps) {
  return (
    <span className={`${styles.tag} ${className}`.trim()}>
      {children}
    </span>
  );
}