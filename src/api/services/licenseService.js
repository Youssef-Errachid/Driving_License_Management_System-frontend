import api from "../axios";

const licenseService = {
    getByDriverId: (driverId) => {
        return api.get(`/licenses/driver/${driverId}`);
    },
    getById: (id) => {
        return api.get(`/licenses/${id}`);
    },
};

export default licenseService;