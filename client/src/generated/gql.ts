/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "query getUser($id: Int!) {\n  user(id: $id) {\n    id\n    email\n  }\n}\n\nquery getAllUsers {\n  allUsers {\n    id\n    email\n  }\n}\n\nmutation loginUser($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n    }\n  }\n}": types.GetUserDocument,
};

export function graphql(source: "query getUser($id: Int!) {\n  user(id: $id) {\n    id\n    email\n  }\n}\n\nquery getAllUsers {\n  allUsers {\n    id\n    email\n  }\n}\n\nmutation loginUser($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n    }\n  }\n}"): (typeof documents)["query getUser($id: Int!) {\n  user(id: $id) {\n    id\n    email\n  }\n}\n\nquery getAllUsers {\n  allUsers {\n    id\n    email\n  }\n}\n\nmutation loginUser($email: String!, $password: String!) {\n  login(email: $email, password: $password) {\n    token\n    user {\n      id\n      email\n    }\n  }\n}"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;