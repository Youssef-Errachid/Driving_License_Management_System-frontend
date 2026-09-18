import api from "../axios";

const licenseCategoryService = {
    getAll: () => {
        return api.get("/license-categories");
    },
    update: (id, data) => {
        return api.put(`/license-categories/${id}`, data);
    },
};

export default licenseCategoryService;