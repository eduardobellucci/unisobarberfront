import { CalendarClock, Home, Scissors, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>
        <Home size={18} />
        Início
      </NavLink>
      <NavLink to="/barbeiros">
        <Scissors size={18} />
        Barbeiros
      </NavLink>
      <NavLink to="/agendamentos">
        <CalendarClock size={18} />
        Agendamentos
      </NavLink>
      <NavLink to="/conta">
        <User size={18} />
        Conta
      </NavLink>
    </nav>
  );
}

