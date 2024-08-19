import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import configuration from './config/configuration';
import { AppLoggerMiddleware } from './middleware/logger/logger.middleware';
import { GameModule } from './modules/game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      subscriptions: {
        'graphql-ws': { path: '/subscriptions' },
        'subscriptions-transport-ws': true,
      },
      context: ({ req }) => {
        return { req };
      },
    }),
    GameModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
