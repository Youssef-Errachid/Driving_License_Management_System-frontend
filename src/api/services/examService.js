import api from "../axios";

const examService = {
    getByRequestId: (requestId) => {
        return api.get(`/exams/request/${requestId}`);
    },
    schedule: (data) => {
        return api.post("/exams", data);
    },
    recordResult: (id, data) => {
        return api.patch(`/exams/${id}/result`, data);
    },
    getById: (id) => {
        return api.get(`/exams/${id}`);
    },
};

export default examService;