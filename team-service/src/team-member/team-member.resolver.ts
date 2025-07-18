import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TeamMemberService } from './team-member.service';
import { TeamMember, CreateTeamMemberInput, UpdateTeamMemberInput, CreateBulkTeamMemberInput } from './team-member.model';

@Resolver(() => TeamMember)
export class TeamMemberResolver {
  constructor(
    private teamMemberService: TeamMemberService
) {}

  // READ - Get all team members
  @Query(() => [TeamMember], { name: 'teamMembers' })
  findAll() {
    return this.teamMemberService.findAll();
  }

  // READ - Get one team member
  @Query(() => TeamMember, { name: 'teamMember' })
  findOne(@Args('id') id: string) {
    return this.teamMemberService.findOne(id);
  }

  // CREATE - Add new team member
  @Mutation(() => TeamMember)
  createTeamMember(@Args('input') input: CreateTeamMemberInput) {
    return this.teamMemberService.create(input);
  }

  // UPDATE - Update team member
  @Mutation(() => TeamMember)
  updateTeamMember(
    @Args('id') id: string,
    @Args('input') input: UpdateTeamMemberInput,
  ) {
    return this.teamMemberService.update(id, input);
  }

  // DELETE - Remove team member
  @Mutation(() => Boolean)
  removeTeamMember(@Args('id') id: string) {
    return this.teamMemberService.remove(id);
  }

  // BULK CREATE - Add multiple team members
  @Mutation(() => [TeamMember])
  createBulkTeamMembers(@Args('input') input: CreateBulkTeamMemberInput) {
    return this.teamMemberService.bulkCreate(input.inputs);
  }
}