import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';

export enum EmploymentType {
  FullTime = 'Full-time',
  PartTime = 'Part-time',
  Intern = 'Intern',
}

registerEnumType(EmploymentType, {
  name: 'EmploymentType',
});

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

  @Field(() => EmploymentType)
  employmentType: EmploymentType;
}

@InputType()
export class CreateTeamMemberInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  role: string;

  @Field(() => EmploymentType)
  employmentType: EmploymentType;
}

@InputType()
export class UpdateTeamMemberInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  role?: string;

  @Field(() => EmploymentType, { nullable: true })
  employmentType?: EmploymentType;
} 