import api from "../../../lib/axios";

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
    getAll: ({ blockingStatus, issueReason, query, page = 0, size = 10 } = {}) => {
        return api.get("/licenses", {
            params: { blockingStatus, issueReason, query, page, size },
        });
    },
};

export default licenseService;