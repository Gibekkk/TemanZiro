import IconNongkrong from "@/assets/icon/nongkrong-non.svg";
import IconJalan from "@/assets/icon/belanja-non.svg";
import IconBelajar from "@/assets/icon/belajar-non.svg";
import IconNonton from "@/assets/icon/hiburan-non.svg";
import IconKuliner from "@/assets/icon/kuliner-non.svg";
import IconOlahraga from "@/assets/icon/olahraga-non.svg";

export type ActivityType = "nongkrong" | "jalan" | "belajar" | "nonton" | "kuliner" | "olahraga";

interface ActivityTextProps {
  type: ActivityType;
}

export default function ActivityText({ type }: ActivityTextProps) {
  const getActivityDetails = (activity: ActivityType) => {
    switch (activity) {
      case "nongkrong":
        return {
          label: "Nongkrong",
          icon: IconNongkrong,
        };
      case "jalan":
        return {
          label: "Jalan-jalan",
          icon: IconJalan,
        };
      case "belajar":
        return {
          label: "Belajar",
          icon: IconBelajar,
        };
      case "nonton":
        return {
          label: "Nonton",
          icon: IconNonton,
        };
      case "kuliner":
        return {
          label: "Kuliner",
          icon: IconKuliner,
        };
      case "olahraga":
        return {
          label: "Olahraga",
          icon: IconOlahraga,
        };
      default:
        return {
          label: "Aktivitas",
          icon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
            </svg>
          ),
          bgColor: "#f5f5f5",
          iconColor: "#757575",
        };
    }
  };

  const { label, icon } = getActivityDetails(type);

  return (
    <p style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
      {typeof icon === "string" ? (
        <img src={icon} alt={label} style={{ width: "14px" }} />
      ) : (
        <span style={{ display: "flex", alignItems: "center" }}>
          {icon}
        </span>
      )}
      
      <span>{label}</span>
    </p>
  );
}
