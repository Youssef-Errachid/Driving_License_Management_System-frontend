import api from "../../../lib/axios.js";


const dashboardService = {
    getAdminDashboard: () => {
        return api.get("/admin/dashboard");
    },
    getAgentDashboard: () => {
        return api.get("/agent/dashboard");
    },
};

export default dashboardService;