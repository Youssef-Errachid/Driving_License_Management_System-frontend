import api from "../../../lib/axios";

const personService = {
    getAll: (page = 0, size = 10) => {
        return api.get("/persons", { params: { page, size } });
    },
    search: (query) => {
        return api.get("/persons/search", { params: { query } });
    },
    getById: (id) => {
        return api.get(`/persons/${id}`);
    },
    create: (data) => {
        return api.post("/persons", data);
    },
    update: (id, data) => {
        return api.put(`/persons/${id}`, data);
    },
};

export default personService;