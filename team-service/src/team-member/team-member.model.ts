import { ObjectType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Intern = 'Intern',
}

registerEnumType(EmploymentType, {
  name: 'EmploymentType',
});

@ObjectType()
@Entity()
export class TeamMember {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  role: string;

  @Field(() => EmploymentType)
  @Column({
    type: 'enum',
    enum: EmploymentType,
  })
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

@InputType()
export class CreateBulkTeamMemberInput {
  @Field(() => [CreateTeamMemberInput])
  inputs: CreateTeamMemberInput[];
} 