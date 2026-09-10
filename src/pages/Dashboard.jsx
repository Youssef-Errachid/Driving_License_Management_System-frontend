import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../dashboards/AdminDashboard";
import AgentDashboard from "../dashboards/AgentDashboard";

function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (user?.role === "AGENT") {
    return <AgentDashboard />;
  }

  return <div>Access denied</div>;
}

export default Dashboard;
