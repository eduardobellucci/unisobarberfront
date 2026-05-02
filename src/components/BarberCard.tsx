import { Link } from "react-router-dom";
import type { Barber } from "../types";
import { RatingStars } from "./RatingStars";

export function BarberCard({ barber }: { barber: Barber }) {
  return (
    <Link to={`/barbeiros/${barber.id}`} className="card list-card">
      <img src={barber.photo} alt={barber.name} />
      <div style={{ flex: 1 }}>
        <h3>{barber.name}</h3>
        <p>{barber.specialties.join(" • ")}</p>
        <div className="row" style={{ marginTop: 6, gap: 12 }}>
          <RatingStars rating={barber.rating} />
          <span className="badge">{barber.reviewCount} avaliações</span>
        </div>
      </div>
    </Link>
  );
}

