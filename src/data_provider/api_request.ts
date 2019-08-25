import { createHttpLink } from 'apollo-link-http'
import { DocumentNode, execute, makePromise } from 'apollo-link'
class ApiError extends Error {
    code: string
    graphqlErrors: Array<any>
}
export async function apiRequest(url:string,gqlQuery: DocumentNode, variables: Object) {
    const operation = {
        query: gqlQuery,
        variables,
    }
    const token = localStorage.getItem('token')
    const headers: {
        Authorization?: string
    } = {}
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const link = createHttpLink({
        uri: url,
        credentials:'include'
    })
    const data: any = await makePromise(execute(link, operation))
    if (data.errors) {
        let e = data.errors[0]
        let error = new ApiError(e.message)
        error.code = e.extensions.code
        error.graphqlErrors = data.errors
        throw error
    }
    return data
}
