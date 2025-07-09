import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMemberResolver } from './team-member.resolver';

@Module({
  providers: [TeamMemberService, TeamMemberResolver],
})
export class TeamMemberModule {}