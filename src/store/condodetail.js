import { GET_CONDO_DETAILS } from "./actions.type";
import { condodetail } from "@/service/condodetail";

function initState() {
  return {}
}

const state = initState();

const actions = {
  async [GET_CONDO_DETAILS]({ }, data) {
    let response = await condodetail.getCondoDetail(data);
    // console.log(response);
    return response;
  },
};


const mutations = {};

const getters = {};

export default {
  state,
  actions,
  mutations,
  getters
};
