import api from "../axios";

const licenseService = {
    create: (data) => {
        return api.post("/licenses", data);
    },
    getById: (id) => {
        return api.get(`/licenses/${id}`);
    },
    getByDriverId: (driverId) => {
        return api.get(`/licenses/driver/${driverId}`);
    },
};

export default licenseService;