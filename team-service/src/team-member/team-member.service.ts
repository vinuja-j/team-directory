import { Injectable } from '@nestjs/common';
import { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput, EmploymentType } from './team-member.model';

@Injectable()
export class TeamMemberService {
  // In-memory storage for team members 
  private teamMembers: TeamMember[] = [
    { id: '1', name: 'Rafel Nate', email: 'rafel@gmail.com', role: 'Developer', employmentType: EmploymentType.FullTime },
    { id: '2', name: 'Jimmy Smith', email: 'jimmy@gmail.com', role: 'Designer', employmentType: EmploymentType.PartTime },
  ];

  private nextId = 3;

  //Get all team members
  findAll(): TeamMember[] {
    return this.teamMembers;
  }

  //Get one team member by ID
  findOne(id: string): TeamMember {
    return this.teamMembers.find(member => member.id === id);
  }

  //Add new team member
  create(input: CreateTeamMemberInput): TeamMember {
    const newMember: TeamMember = {
      id: this.nextId.toString(),
      ...input,
    };
    this.nextId++;
    this.teamMembers.push(newMember);
    return newMember;
  }

  //Bulk add team members
  bulkCreate(inputs: CreateTeamMemberInput[]): TeamMember[] {
    return inputs.map(input => this.create(input));
  }

  //Update existing team member
  update(id: string, input: UpdateTeamMemberInput): TeamMember {
    const memberIndex = this.teamMembers.findIndex(member => member.id === id);
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    this.teamMembers[memberIndex] = {
      ...this.teamMembers[memberIndex],
      ...input,
    };

    return this.teamMembers[memberIndex];
  }

  //Remove team member
  remove(id: string): boolean {
    const memberIndex = this.teamMembers.findIndex(member => member.id === id);
    if (memberIndex === -1) {
      return false;
    }

    this.teamMembers.splice(memberIndex, 1);
    return true;
  }
} 