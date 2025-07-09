import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class TeamMember {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@InputType()
export class CreateTeamMemberInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;
}

@InputType()
export class UpdateTeamMemberInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  role?: string;
} 