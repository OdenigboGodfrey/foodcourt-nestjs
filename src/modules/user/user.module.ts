import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'WINSTON_MODULE_PROVIDER',
      useValue: { error: () => {}, info: () => {} },
    },
    {
      provide: 'CACHE_MANAGER',
      useValue: {},
    },
  ],
})
export class UserModule {}
