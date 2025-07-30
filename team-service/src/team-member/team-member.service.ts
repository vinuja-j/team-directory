import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput } from './team-member.model';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
    @InjectQueue('bulk-team-member')
    private bulkTeamMemberQueue: Queue,
  ) {}

  findAll(): Promise<TeamMember[]> {
    return this.teamMemberRepository.find();
  }

  findOne(id: number): Promise<TeamMember | null> {
    return this.teamMemberRepository.findOneBy({ id });
  }

  create(input: CreateTeamMemberInput): Promise<TeamMember> {
    const member = this.teamMemberRepository.create(input);
    return this.teamMemberRepository.save(member);
  }

  bulkCreate(inputs: CreateTeamMemberInput[]): Promise<TeamMember[]> {
    const members = this.teamMemberRepository.create(inputs);
    return this.teamMemberRepository.save(members);
  }

  async update(id: number, input: UpdateTeamMemberInput): Promise<TeamMember> {
    await this.teamMemberRepository.update(id, input);
    return this.teamMemberRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.teamMemberRepository.delete(id);
    return result.affected > 0;
    }

  async enqueueBulkImport(inputs: CreateTeamMemberInput[]) {
    await this.bulkTeamMemberQueue.add('import', { inputs });
  }
} 