import React from "react";
// Sesuaikan import CSS-nya dengan file CSS yang kamu gunakan (misal: profile_details.module.css)
import style from "./ratingreview.module.css";

interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

interface RatingReviewProps {
  overallRating: string;
  ratingDistribution: { star: number; count: number }[];
  reviews: Review[];
}

export default function RatingReviewSection({
  overallRating,
  ratingDistribution,
  reviews,
}: RatingReviewProps) {
  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count), 1);

  return (
    <div className={style.content}>
      <div className={style.ratingHeader}>
        <h2 className={style.overallRating}>{overallRating}</h2>

        <div className={style.ratingBars}>
          {[...ratingDistribution]
            .sort((a, b) => b.star - a.star)
            .map((item) => (
              <div key={item.star} className={style.ratingRow}>
                <span>{item.star}</span>
                <div className={style.barTrack}>
                  <div
                    className={style.barFill}
                    style={{ width: `${(item.count / maxRatingCount) * 100}%` }}
                  ></div>
                </div>
                <span>{item.count}</span>
              </div>
            ))}
        </div>
      </div>

      <div className={style.reviewScrollContainer}>
        {reviews.map((review) => (
          <div key={review.id} className={style.reviewCard}>
            <div className={style.reviewHeader}>
              <div className={style.reviewerInfo}>
                <img
                  src={review.avatar}
                  alt={review.name}
                  className={style.reviewerAvatar}
                />
                <h4 className={style.reviewerName}>{review.name}</h4>
              </div>
              <div className={style.reviewStar}>
                <svg
                  className={style.starIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {review.rating.toFixed(1)}
              </div>
            </div>
            <p className={style.reviewText}>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
