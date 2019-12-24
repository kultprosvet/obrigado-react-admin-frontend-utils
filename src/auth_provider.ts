
//@ts-ignore
import {AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_GET_PERMISSIONS, AUTH_ERROR,} from 'react-admin'
import { apiRequest } from './data_provider/api_request'
import gql from 'graphql-tag';
export function buildAuthProvider(url:string,debug=false) {
   return  async (type: string, params: any) => {
        if (debug) console.log(type, params)
        if (type === AUTH_LOGIN) {
            try {
                const { username, password } = params
                await apiRequest(url,
                    gql`
                    mutation($username: String!, $password: String!) {
                        adminLogin(username: $username, password: $password) {
                            id
                            last_name
                            first_name     
                            token                   
                        }
                    }
                `,
                    {
                        username: username,
                        password: password,
                    },
                )

                        return Promise.resolve('SUCCESS')


            } catch (e) {
                console.error('exc', e)
                return Promise.reject('Unknown method')
            }
        }
        if (type === AUTH_CHECK)  {
            return  apiRequest(url,
                gql`
                    query {
                        adminCheck{
                            id                              
                        }
                    }
                `,{}
            )


        }
        if (type === AUTH_LOGOUT) {
            try {
                sessionStorage.clear()
                await apiRequest(url,
                    gql`
                mutation {
                    adminLogOut {
                        code
                    }
                }
            `,
                    {},
                )
                return Promise.resolve()
            }catch (e) {
                return Promise.resolve()
            }
        }
        if (type == AUTH_GET_PERMISSIONS) {
            try {
                let data:any = await apiRequest(url,
                    gql`
                    query {
                        adminCheck{
                            id
                            permissions                                 
                        }
                    }
                `, {}
                )
                return data.data.adminCheck.permissions
            } catch (e) {
                if (debug) console.log(e)
                return Promise.resolve([])
            }

        }
        if (type === AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not authenticated')
            }
            return Promise.resolve()
        }

        return Promise.resolve()
    }
}