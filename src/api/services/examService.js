import api from "../axios";

const examService = {
    getByRequestId: (requestId) => {
        return api.get(`/exams/request/${requestId}`);
    },
    getAll: ({ appointmentDate, examType, pendingOnly = false, page = 0, size = 10 } = {}) => {
        return api.get("/exams", {
            params: { appointmentDate, examType, pendingOnly, page, size },
        });
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