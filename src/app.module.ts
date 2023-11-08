import { join } from "path";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { Module } from "@nestjs/common";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { ItemsModule } from "./items/items.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: false,
      includeStacktraceInErrorResponses: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),
    ItemsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
