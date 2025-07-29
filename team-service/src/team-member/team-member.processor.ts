import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TeamMemberService } from './team-member.service';
import { CreateTeamMemberInput } from './team-member.model';

@Processor('bulk-team-member')
export class TeamMemberProcessor {
    constructor(private readonly teamMemberService: TeamMemberService) {}

    @Process('import')
  async handleBulkImport(job: Job<{ inputs: CreateTeamMemberInput[] }>) {
    const { inputs } = job.data;
    // Using service to bulk create team members
    await this.teamMemberService.bulkCreate(inputs);
  }
}
