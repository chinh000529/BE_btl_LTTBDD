import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm"; 
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { ValidUserMiddleware } from "../common/middleware/validUser.middleware"

@Module({
  imports: [TypeOrmModule.forFeature([User]),],
  providers: [UserService,],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidUserMiddleware).forRoutes({
      path: "users/:userId",
      method: RequestMethod.GET,
    });
    consumer.apply(ValidUserMiddleware).forRoutes({
      path: 'users/:userId',
      method: RequestMethod.PUT,
    });
    consumer.apply(ValidUserMiddleware).forRoutes({
      path: 'users/:userId',
      method: RequestMethod.DELETE,
    });
  }
}