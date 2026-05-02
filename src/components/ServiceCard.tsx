import type { Service } from "../types";
import { formatCurrency } from "../utils/date";

export function ServiceCard({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: (service: Service) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(service)}
      className="card"
      style={{
        textAlign: "left",
        borderColor: selected ? "var(--primary)" : "var(--border)",
        background: selected ? "rgba(59, 130, 246, 0.15)" : "var(--surface)",
      }}
    >
      <div className="row-between">
        <div>
          <strong>{service.name}</strong>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.85rem" }}>
            {service.description}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600 }}>{formatCurrency(service.price)}</div>
          <small style={{ color: "var(--muted)" }}>{service.duration} min</small>
        </div>
      </div>
    </button>
  );
}

