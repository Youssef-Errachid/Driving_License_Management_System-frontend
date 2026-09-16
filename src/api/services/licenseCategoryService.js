import api from "../axios";

const licenseCategoryService = {
    getAll: () => {
        return api.get("/license-categories");
    },
};

export default licenseCategoryService;