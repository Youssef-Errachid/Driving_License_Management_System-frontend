import api from "../axios";

const paymentService = {
    create: (data) => {
        return api.post("/payments", data);
    },
    getById: (id) => {
        return api.get(`/payments/${id}`);
    },
    getByRequestId: (requestId) => {
        return api.get(`/payments/request/${requestId}`);
    },
};

export default paymentService;