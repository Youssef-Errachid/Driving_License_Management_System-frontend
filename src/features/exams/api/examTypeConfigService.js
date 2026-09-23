import api from "../../../lib/axios";

const examTypeConfigService = {
    getAll: () => {
        return api.get("/exam-type-configs");
    },
    update: (id, data) => {
        return api.put(`/exam-type-configs/${id}`, data);
    },
};

export default examTypeConfigService;