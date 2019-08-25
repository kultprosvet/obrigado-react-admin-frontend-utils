
//@ts-ignore
import {AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_GET_PERMISSIONS, AUTH_ERROR,} from 'react-admin'
import { apiRequest } from './data_provider/api_request'
import gql from 'graphql-tag';

//let permissions = ''
export function buildAuthProvider(url:string,debug=false) {
   return  (type: string, params: any) => {
        if (debug) console.log(type, params)
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
                            token                   
                        }
                    }
                `,
                    {
                        username: username,
                        password: password,
                    },
                )
                    .then(data => {
                        return Promise.resolve('SUCCESS')
                    })
                    .catch(e => {
                        console.error('exc', e)
                        return Promise.reject()
                    })
            } catch (e) {
                console.error('exc', e)
                return Promise.reject('Unknown method')
            }
        }
        if (type === AUTH_CHECK)  {
            return apiRequest(url,
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
            sessionStorage.clear()
            return apiRequest(url,
                gql`
                mutation {
                    adminLogOut {
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
                //@ts-ignore
                return Promise.resolve(JSON.parse(sessionStorage.getItem('permissions')) )
            }else {
                return apiRequest(url,
                    gql`
                    query {
                        adminCheck{
                            id                                 
                        }
                    }
                `, {}
                ).then(()=>{
                    //TODO  fetch permissions from server
                    sessionStorage.setItem("permissions",JSON.stringify(["admin"]))
                    return Promise.resolve(["admin"])
                })
            }
        }
        if (type === AUTH_ERROR) {
            if (params.message.match(/GraphQL error: Access denied/)) {
                return Promise.reject('You are not  authentificated')
            }
            return Promise.resolve()
        }

        return Promise.resolve()
    }
}

