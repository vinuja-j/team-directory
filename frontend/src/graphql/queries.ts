import { gql } from "@apollo/client";

export const  GET_TEAM_MEMBERS = gql`
    query GetTeamMembers {
        teamMembers {
        id
        name
        email
        role
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
        }
    }
`;

export const REMOVE_TEAM_MEMBER = gql`
    mutation RemoveTeamMember($id: String!) {
        removeTeamMember(id: $id)
    }
`;

//TypeScript interfaces for the queries and mutations
export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface CreateTeamMemberInput {
    name: string;
    email: string;
    role: string;
}

export interface UpdateTeamMemberInput {
    name?: string;
    email?: string;
    role?: string;
}