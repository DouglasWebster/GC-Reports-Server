import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'
import { DatabaseModule } from '../db/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CompFormModule } from './comp-form/comp-form.module';
// import { CompetitionModule } from './competition/competition.module';
// import { MemberModule } from './member/member.module';
// import { PlayerModule } from './player/player.module';
// import { TeeModule } from './tee/tee.module';
// import { UpdateResultsModule } from './update-results/update-results.module';
// import { TwoModule } from './two/two.module';
// import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './auth/jwt.auth-guards';

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        user: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
      }),
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    // TeeModule,
    // CompFormModule,
    // CompetitionModule,
    // PlayerModule,
    // UpdateResultsModule,
    // MemberModule,
    // TwoModule,
    // HealthModule,
    // AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtAuthGuard }],
})
export class AppModule {}
