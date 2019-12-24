import { DocumentNode } from 'apollo-link';
export declare function apiRequest(url: string, gqlQuery: DocumentNode, variables: Object): Promise<any>;
