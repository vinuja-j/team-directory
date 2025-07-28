import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput } from './team-member.model';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  // Get all team members
  findAll(): Promise<TeamMember[]> {
    return this.teamMemberRepository.find();
  }

  // Get one team member by ID
  findOne(id: number): Promise<TeamMember | null> {
    return this.teamMemberRepository.findOneBy({ id });
  }

  // Add new team member
  create(input: CreateTeamMemberInput): Promise<TeamMember> {
    const member = this.teamMemberRepository.create(input);
    return this.teamMemberRepository.save(member);
  }

  // Bulk add team members
  bulkCreate(inputs: CreateTeamMemberInput[]): Promise<TeamMember[]> {
    const members = this.teamMemberRepository.create(inputs);
    return this.teamMemberRepository.save(members);
  }

  // Update existing team member
  async update(id: number, input: UpdateTeamMemberInput): Promise<TeamMember> {
    await this.teamMemberRepository.update(id, input);
    return this.teamMemberRepository.findOneBy({ id });
  }

  // Remove team member
  async remove(id: number): Promise<boolean> {
    const result = await this.teamMemberRepository.delete(id);
    return result.affected > 0;
  }
} 