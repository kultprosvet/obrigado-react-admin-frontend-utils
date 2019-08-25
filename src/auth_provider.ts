
//@ts-ignore
import {AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_GET_PERMISSIONS, AUTH_ERROR,} from 'react-admin'
import { apiRequest } from './data_provider/api_request'
import gql from 'graphql-tag'
;
//let permissions = ''
export function buildAuthProvider(url:string) {
   return  (type: string, params: any) => {
        console.log(type, params)
        if (type === AUTH_LOGIN) {
            try {
                const { username, password } = params
                return apiRequest(url,
                    gql`
                    mutation($username: String!, $password: String!) {
                        adminLogin(username: $username, password: $password) {
                            id
                            last_name
                            first_name                        
                        }
                    }
                `,
                    {
                        username: username,
                        password: password,
                    },
                )
                    .then(data => {
                       // permissions = data.data.adminLogin.role
                        return Promise.resolve('SUCCESS')
                    })
                    .catch(e => {
                        console.log('exc', e)
                        return Promise.reject()
                    })
            } catch (e) {
                console.log('exc', e)
                return Promise.reject('Unknown method')
            }
        }
        if (type === AUTH_CHECK) {
            return apiRequest(url,
                gql`
                    query {
                        admin{
                            id                                 
                        }
                    }
                `,{}
            )

        }
        if (type === AUTH_LOGOUT) {
            return apiRequest(url,
                gql`
                mutation {
                    logOut {
                        code
                    }
                }
            `,
                {},
            )
                .then(data => {
                    return Promise.resolve()
                })
                .catch(e => {
                    console.log('exc', e)
                    return Promise.resolve()
                })
        }
        if (type == AUTH_GET_PERMISSIONS) {
            if (sessionStorage.getItem("permissions")){
                return Promise.resolve(true)
            }else {
                return apiRequest(url,
                    gql`
                    query {
                        admin{
                            id                                 
                        }
                    }
                `, {}
                ).then(()=>{
                    sessionStorage.setItem("permissions","admin")
                    return Promise.resolve(true)
                })
            }
        }
        if (type === AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not authentificated')
            }
            return Promise.resolve()
        }

        return Promise.resolve()
    }
}

