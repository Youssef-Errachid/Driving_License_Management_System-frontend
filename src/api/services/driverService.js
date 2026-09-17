import api from "../axios";

const driverService = {
    search: ({ nationalNumber, licenseNumber } = {}) => {
        return api.get("/drivers/search", { params: { nationalNumber, licenseNumber } });
    },
    getById: (id) => {
        return api.get(`/drivers/${id}`);
    },
};

export default driverService;