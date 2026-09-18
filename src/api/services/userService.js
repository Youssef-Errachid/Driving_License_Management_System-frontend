import api from "../axios";

const userService = {
    getAll: (page = 0, size = 10) => {
        return api.get("/users", { params: { page, size } });
    },
    getById: (id) => {
        return api.get(`/users/${id}`);
    },
    create: (data) => {
        return api.post("/users", data);
    },
    update: (id, data) => {
        return api.put(`/users/${id}`, data);
    },
    delete: (id) => {
        return api.delete(`/users/${id}`);
    },
};

export default userService;