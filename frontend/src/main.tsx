import { createRoot } from "react-dom/client";
import { AppRoutes } from "./app/navigation/AppRoutes";
import { AuthProvider } from "./app/store/authContext";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);
