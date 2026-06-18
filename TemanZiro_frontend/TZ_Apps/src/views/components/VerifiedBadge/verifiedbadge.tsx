import React from 'react';
import style from './verifiedbadge.module.css';

import IconVerified from "@/assets/icon/icon-verified.svg";
import { useAuth } from "@/controllers/hooks/useAuth";

interface VerifiedBadgeProps {
  text?: string; // Opsional: jika ingin mengganti teks di tempat lain
  enable?: boolean; 
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ text = 'Terverifikasi', enable = false }) => {
  const { isVerified } = useAuth();
  const shouldDisplay = enable || isVerified;

  if (!shouldDisplay) return null;
  
  return (
    <div className={style.verified}>
      <img src={IconVerified} alt="Verified" />
      <p className={style.verifiedText}>{text}</p>
    </div>
  );
};

export default VerifiedBadge;