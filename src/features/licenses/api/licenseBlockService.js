import api from "../../../lib/axios";

const licenseBlockService = {
    getByLicenseId: (licenseId) => {
        return api.get(`/license-blocks/license/${licenseId}`);
    },
    block: (data) => {
        return api.post("/license-blocks", data);
    },
};

export default licenseBlockService;