import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './team-member.model';
import { TeamMemberService } from './team-member.service';
import { TeamMemberResolver } from './team-member.resolver';
import { BullModule } from '@nestjs/bull';
import { TeamMemberProcessor } from './team-member.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamMember]),
    BullModule.registerQueue({
      name: 'bulk-team-member',
    }),
  ],
  providers: [TeamMemberService, TeamMemberResolver, TeamMemberProcessor],
})
export class TeamMemberModule {}