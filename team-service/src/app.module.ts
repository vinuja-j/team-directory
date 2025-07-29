import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TeamMemberModule } from './team-member/team-member.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { TeamMember } from './team-member/team-member.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mariadb',
      host:'localhost',
      port: 3306,
      username:'root',
      password:'teamdata',
      database:'teamdirectory',
      entities: [TeamMember],
      autoLoadEntities: true,
      synchronize:true,
    }),
    
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql', 
      sortSchema: true, 
      playground: true, 
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    TeamMemberModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
