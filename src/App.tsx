import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./hooks/useAuth";
import { SettingsProvider } from "./hooks/useSettings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <div className="app-root">
            <div className="app-shell">
              <AppRoutes />
            </div>
          </div>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

