/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createCouncil = /* GraphQL */ `
  mutation CreateCouncil(
    $input: CreateCouncilInput!
    $condition: ModelCouncilConditionInput
  ) {
    createCouncil(input: $input, condition: $condition) {
      id
      level
      createdAt
      updatedAt
    }
  }
`;
export const updateCouncil = /* GraphQL */ `
  mutation UpdateCouncil(
    $input: UpdateCouncilInput!
    $condition: ModelCouncilConditionInput
  ) {
    updateCouncil(input: $input, condition: $condition) {
      id
      level
      createdAt
      updatedAt
    }
  }
`;
export const deleteCouncil = /* GraphQL */ `
  mutation DeleteCouncil(
    $input: DeleteCouncilInput!
    $condition: ModelCouncilConditionInput
  ) {
    deleteCouncil(input: $input, condition: $condition) {
      id
      level
      createdAt
      updatedAt
    }
  }
`;
export const createRestrictions = /* GraphQL */ `
  mutation CreateRestrictions(
    $input: CreateRestrictionsInput!
    $condition: ModelRestrictionsConditionInput
  ) {
    createRestrictions(input: $input, condition: $condition) {
      id
      overview
      open
      closed
      createdAt
      updatedAt
    }
  }
`;
export const updateRestrictions = /* GraphQL */ `
  mutation UpdateRestrictions(
    $input: UpdateRestrictionsInput!
    $condition: ModelRestrictionsConditionInput
  ) {
    updateRestrictions(input: $input, condition: $condition) {
      id
      overview
      open
      closed
      createdAt
      updatedAt
    }
  }
`;
export const deleteRestrictions = /* GraphQL */ `
  mutation DeleteRestrictions(
    $input: DeleteRestrictionsInput!
    $condition: ModelRestrictionsConditionInput
  ) {
    deleteRestrictions(input: $input, condition: $condition) {
      id
      overview
      open
      closed
      createdAt
      updatedAt
    }
  }
`;
