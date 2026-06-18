import style from './chatitem.module.css';

interface ChatItemProps {
  name: string;
  time: string;
  highlightText?: string; 
  previewText: string;
  avatarUrl?: string;     
  isOnline: boolean;
  navigateToChat?: () => void;
}

export default function ChatItem({ 
  name, 
  time, 
  highlightText, 
  previewText, 
  avatarUrl, 
  isOnline,
  navigateToChat,
}: ChatItemProps) {
  
  return (
    <div className={style.chatItem} onClick={navigateToChat} role="button" tabIndex={0}>
      <div className={style.avatarContainer}>
        <img
          src={avatarUrl || "https://via.placeholder.com/150"}
          alt={name}
          className={style.avatarImage}
        />
        {isOnline && <div className={style.onlineIndicator}></div>}
      </div>

      <div className={style.chatContent}>
        <div className={style.chatHeader}>
          <h3 className={style.chatName}>{name}</h3>
          <span className={style.chatTime}>{time}</span>
        </div>
        
        {highlightText && (
          <p className={style.chatHighlight}>
            {highlightText}
          </p>
        )}
        
        <p className={style.chatPreview}>
          {previewText}
        </p>
      </div>
    </div>
  );
}