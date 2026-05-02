import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="row" style={{ gap: "6px" }}>
      <Star size={16} color="#f59e0b" fill="#f59e0b" />
      <span>{rounded.toFixed(1)}</span>
    </div>
  );
}

