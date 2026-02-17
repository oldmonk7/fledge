import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './modules/employees/employees.module';
import { FSAAccountsModule } from './modules/fsa-accounts/fsa-accounts.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlaidModule } from './modules/plaid/plaid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'src/.env'], // Try both project root and src directory
    }),
    TypeOrmModule.forRoot(
      process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
          }
        : {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5433'),
            username: process.env.DB_USERNAME || 'fledge_user',
            password: process.env.DB_PASSWORD || 'fledge_password',
            database: process.env.DB_NAME || 'fledge',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: process.env.NODE_ENV !== 'production', // Don't use in production
            logging: process.env.NODE_ENV === 'development',
          },
    ),
    UsersModule,
    EmployeesModule,
    FSAAccountsModule,
    AuthModule,
    PlaidModule,
  ],
})
export class AppModule {}
