import api from "../axios";

const driverService = {
    getAll: (page = 0, size = 10) => {
        return api.get("/drivers", { params: { page, size } });
    },
    getById: (id) => {
        return api.get(`/drivers/${id}`);
    },
    search: ({ nationalNumber, licenseNumber }) => {
        return api.get("/drivers/search", { params: { nationalNumber, licenseNumber } });
    },
};

export default driverService;