import { apiRequest } from "./data_provider/api_request";
import gql from "graphql-tag";

let API: string;
const config = {
  init(url: string) {
    API = url;
  },
  getAPI() {
    return API;
  },
  async getRolesList() {
    let data: any;
    await apiRequest(
      API,
      gql`
        query {
          getRoles
        }
      `,
      {}
    )
      .then(response => (data = response))
      .catch(e => console.log(e));
    return data.data.getRoles;
  }
};

export default config;
