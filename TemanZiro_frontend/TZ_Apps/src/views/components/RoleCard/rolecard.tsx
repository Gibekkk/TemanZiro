// RoleCard.jsx
import style from "./rolecard.module.css";

interface RoleCardProps {
  title: string;
  description: string;
  roleName: string;
  image: string;
  icon: string;
  isActive: boolean;
  onSelect: () => void;
}

export default function RoleCard({
  title,
  description,
  roleName,
  image,
  icon,
  isActive,
  onSelect,
}: RoleCardProps) {
  return (
    <div
      className={`${style.roleContainer} ${isActive ? style.activeCard : ""}`}
      onClick={onSelect}
    >
      <div className={style.img}>
        <img src={image} alt={title} />
      </div>
      <div className={style.content}>
        <div className={style.contentTitle}>
          <img src={icon} alt="icon" />
          <h3>{title}</h3>
        </div>
        <p className={style.contentText}>{description}</p>
        <div className={style.footerContent}>
          <h3>{roleName}</h3>
          <button
            className={`${style.nextButton} ${isActive ? style.activeButton : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isActive ? "Pilih" : "Pilih"}
          </button>
        </div>
      </div>
    </div>
  );
}
