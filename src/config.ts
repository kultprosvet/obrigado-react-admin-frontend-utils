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
    try {
      const response=await apiRequest(
          API,
          gql`
        query {
          getRoles{
            id
            name  
          }
        }
      `,
          {}
      )
      return response.data.getRoles
    }catch (e) {
      console.error(e)
      return  []
    }
  }
};

export default config;
