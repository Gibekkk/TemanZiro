import styles from "./notifcard.module.css";

import IconBell from "@/assets/icon/bell.svg";
import IconMoney from "@/assets/icon/money.svg";
import IconFriends from "@/assets/icon/friends.svg";

const NOTIFICATION_DATA = {
  pencairandana: { icon: IconMoney },
  matchrequest: { icon: IconFriends },
  pesanan: { icon: IconBell },
} as const;

interface BaseNotification {
  date: string;
  onClick?: () => void;
}

interface PencairanDanaProps extends BaseNotification {
  type: "pencairandana";
  status: string;
  amount: string | number;
}

interface MatchRequestProps extends BaseNotification {
  type: "matchrequest";
  activity: string;
  activityDate: string;
  userName: string;
}

interface PesananProps extends BaseNotification {
  type: "pesanan";
  title: string;
}

export type NotificationCardProps = PencairanDanaProps | MatchRequestProps | PesananProps;

export default function NotificationCard(props: NotificationCardProps) {
  const data = NOTIFICATION_DATA[props.type];

  if (!data) return null;

  const renderTextContent = () => {
    switch (props.type) {
      case "pencairandana":
        return (
          <>
            <h4 className={styles.title}>Pencairan Dana {props.status}</h4>
            <p className={styles.subtitle}>Nominal: {props.amount}</p>
          </>
        );

      case "matchrequest":
        return (
          <>
            <h4 className={styles.title}>
              {props.userName} mengajak {props.activity}
            </h4>
            <p className={styles.subtitle}>Jadwal: {props.activityDate}</p>
          </>
        );

      case "pesanan":
        return (
          <>
            <h4 className={styles.title}>{props.title}</h4>
          </>
        );
    }
  };

  return (
    <div
      className={styles.card}
      onClick={props.onClick}
      style={{ cursor: props.onClick ? "pointer" : "default" }}
    >
      <div className={styles.iconContainer}>
        <img
          src={data.icon}
          alt={`Icon ${props.type}`}
          className={styles.icon}
        />
      </div>
      <div className={styles.textContainer}>
        {renderTextContent()}

        <p className={styles.date}>{props.date}</p>
      </div>
    </div>
  );
}
