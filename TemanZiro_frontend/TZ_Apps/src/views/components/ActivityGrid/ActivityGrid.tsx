import React from "react";
import nongkrongImg from "@/assets/image/nongkrong.jpg";
import olahragaImg from "@/assets/image/olahraga.jpg";
import belajarImg from "@/assets/image/belajar.jpg";
import jalanImg from "@/assets/image/jalan.jpg";
import hiburanImg from "@/assets/image/hiburan.jpg";
import kulinerImg from "@/assets/image/kuliner.jpg";
import "./activitygrid.css";
import { useNavigate } from "react-router-dom";

export const activities = [
  { id: "1", title: "Nongkrong", vibes: "Cafe & Chill", image: nongkrongImg },
  { id: "2", title: "Olahraga", vibes: "Sports & Active", image: olahragaImg },
  { id: "3", title: "Belajar", vibes: "Study & Work", image: belajarImg },
  { id: "4", title: "Jalan-jalan", vibes: "Explore & Travel", image: jalanImg },
  { id: "5", title: "Hiburan", vibes: "Film & Events", image: hiburanImg },
  { id: "6", title: "Kuliner", vibes: "Food & Dining", image: kulinerImg },
];

export default function ActivityGrid() {
  const navigate = useNavigate();

  const handleSelect = (activity: (typeof activities)[0]) => {
    navigate("/set-preference", {
      state: {
        selectedActivityId: activity.id,
        selectedActivityName: activity.title,
      },
    });
  };

  return (
    <div className="activity-grid">
      {activities.map((activity) => (
        <button
          key={activity.id}
          type="button"
          className="activity-card"
          onClick={() => handleSelect(activity)}
        >
          <div className="activity-image-wrapper">
            <img
              src={activity.image}
              alt={activity.title}
              className="activity-image"
            />
          </div>

          <div className="activity-text">
            <h3>{activity.title}</h3>
            <p>{activity.vibes}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
