import axios from 'axios';
// import * as queryString from "query-string";

export const condodetail = {
    getCondoDetail() {
        return axios({
            method: 'GET',
            url: `https://origin-console-service.onrender.com/api/condo_details`,
        })
            .then(function (response) {
                return response.data
            }).catch(() => {
                return false
            });
    },
};