import { ReactNode } from 'react';
import styles from './orangebutton.module.css';

interface ButtonProps {
  children: ReactNode;        
  onClick?: () => void;        
  type?: 'button' | 'submit';  
  variant?: 'primary' | 'outline' | 'ghost'; 
  className?: string;
  shadow?: 'default' | 'none';
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  className = '',
  shadow = 'default',
  disabled = false
}: ButtonProps) {
  
  let baseStyle = "px-6 py-2 rounded-full font-semibold transition-all duration-200 ";

  if (variant === 'primary') {
    baseStyle += ` ${styles.orangebtn}`;
  } else if (variant === 'outline') {
    baseStyle += ` ${styles.orangebtnoutline}`;
  } else if (variant === 'ghost') {
    baseStyle += ` ${styles.orangebtnghost}`;
  }

  if (shadow !== 'none') {
    baseStyle += ` ${styles.hasShadow}`;
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </button>
  );
}