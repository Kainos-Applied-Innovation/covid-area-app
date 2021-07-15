/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCouncil = /* GraphQL */ `
  query GetCouncil($id: ID!) {
    getCouncil(id: $id) {
      id
      level
      createdAt
      updatedAt
    }
  }
`;
export const listCouncils = /* GraphQL */ `
  query ListCouncils(
    $filter: ModelCouncilFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCouncils(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        level
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRestrictions = /* GraphQL */ `
  query GetRestrictions($id: ID!) {
    getRestrictions(id: $id) {
      id
      overview
      open
      closed
      createdAt
      updatedAt
    }
  }
`;
export const listRestrictionss = /* GraphQL */ `
  query ListRestrictionss(
    $filter: ModelRestrictionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRestrictionss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        overview
        open
        closed
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
