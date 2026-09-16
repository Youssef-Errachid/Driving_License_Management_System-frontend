import api from "../axios";

const requestService = {
    getAll: ({ status, serviceType, nationalNumber, page = 0, size = 10 } = {}) => {
        return api.get("/requests", {
            params: { status, serviceType, nationalNumber, page, size },
        });
    },
    getById: (id) => {
        return api.get(`/requests/${id}`);
    },
    create: (data) => {
        return api.post("/requests", data);
    },
    cancel: (id) => {
        return api.patch(`/requests/${id}/cancel`);
    },
};

export default requestService;