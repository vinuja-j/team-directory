import { gql } from "@apollo/client";

export const  GET_TEAM_MEMBERS = gql`
    query GetTeamMembers {
        teamMembers {
        id
        name
        email
        role
        employmentType
        }
    }
`;
export const GET_TEAM_MEMBER = gql`
    query GetTeamMember($id: String!) {
        teamMember(id: $id) {
        id
        name
        email
        role
        employmentType
        }
    }
`;

export const CREATE_TEAM_MEMBER = gql`
    mutation CreateTeamMember($input: CreateTeamMemberInput!) {
        createTeamMember(input: $input) {
        id
        name
        email
        role
        employmentType
        }
    }
`;

export const UPDATE_TEAM_MEMBER = gql`
    mutation UpdateTeamMember($id: String!, $input: UpdateTeamMemberInput!) {
        updateTeamMember(id: $id, input: $input) {
        id
        name
        email
        role
        employmentType
        }
    }
`;

export const REMOVE_TEAM_MEMBER = gql`
    mutation RemoveTeamMember($id: String!) {
        removeTeamMember(id: $id)
    }
`;

export const CREATE_BULK_TEAM_MEMBERS = gql`
  mutation CreateBulkTeamMembers($input: CreateBulkTeamMemberInput!) {
    createBulkTeamMembers(input: $input) {
      id
      name
      email
      role
      employmentType
    }
    }
`;

//TypeScript interfaces for the queries and mutations
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    employmentType: 'FullTime' | 'PartTime' | 'Intern';
}

export interface CreateTeamMemberInput {
    name: string;
    email: string;
    role: string;
    employmentType: 'FullTime' | 'PartTime' | 'Intern';
}

export interface UpdateTeamMemberInput {
    name?: string;
    email?: string;
    role?: string;
    employmentType?: 'FullTime' | 'PartTime' | 'Intern';
}

export interface CreateBulkTeamMemberInput {
    inputs: CreateTeamMemberInput[];
}