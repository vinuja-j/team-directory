import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.model';
import { TeamMemberService } from './team-member.service';
import { TeamMemberResolver } from './team-member.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],
  providers: [TeamMemberService, TeamMemberResolver],
})
export class TeamMemberModule {}