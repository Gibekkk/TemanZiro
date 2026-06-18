import styles from "./iconlabel.module.css";

interface IconLabelProps {
  icon: string;
  label: string;
  color: string;
}

export default function IconLabel({ icon, label, color }: IconLabelProps) {
  return (
    <div className={styles.logo}>
      <div
        className={styles.container}
        style={color ? ({ "--icon-bg": color } as React.CSSProperties) : {}}
      >
        <img src={icon} alt="Logo" />
      </div>
      {label && label !== "none" && <p className={styles.label}>{label}</p>}
    </div>
  );
}
