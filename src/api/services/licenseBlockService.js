import api from "../axios";

const licenseBlockService = {
    getByLicenseId: (licenseId) => {
        return api.get(`/license-blocks/license/${licenseId}`);
    },
};

export default licenseBlockService;