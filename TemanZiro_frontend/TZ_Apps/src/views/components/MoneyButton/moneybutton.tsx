import React from 'react';
import style from './moneybutton.module.css';
import { useAuth } from "@/controllers/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Pastikan path import ikon sesuai dengan struktur folder Anda
import IconWallet from '@/assets/icon/money.svg';

interface MoneyButtonProps {
  onClick?: () => void;
}

const MoneyButton: React.FC<MoneyButtonProps> = ({ onClick }) => {
  const { role } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick && role === "companion") {
      navigate('/money-pages');
    } else {
      navigate('/topup-money');
    }
  };

  return (
    <button className={style.moneyButton} onClick={handleClick}>
      <img src={IconWallet} alt="Money Icon" className={style.moneyIcon} />
      <span className={style.moneyText}>Money</span>
    </button>
  );
};

export default MoneyButton;