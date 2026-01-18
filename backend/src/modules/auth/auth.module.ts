import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AccessToken } from '../../entities/access-token.entity';
import { Employee } from '../../entities/employee.entity';
import { FSAAccount } from '../../entities/fsa-account.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([AccessToken, Employee, FSAAccount, User]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}