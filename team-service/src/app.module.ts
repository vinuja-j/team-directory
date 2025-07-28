import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TeamMemberModule } from './team-member/team-member.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mariadb',
      host:'localhost',
      port: 3306,
      username:'root',
      password:'teamdata',
      database:'teamdirectory',
      autoLoadEntities: true,
      synchronize:true,
    }),
    //Just GraphQL module for now
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql', 
      sortSchema: true, // Sort schema types
      playground: true, // Enable GraphQL Playground
    }),
    TeamMemberModule, // Import the TeamMemberModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
