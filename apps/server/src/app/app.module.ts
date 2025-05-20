import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        user: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TeeModule,
    // CompFormModule,
    // CompetitionModule,
    // PlayerModule,
    // UpdateResultsModule,
    // MemberModule,
    // TwoModule,
    // HealthModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtAuthGuard }],
})
export class AppModule {}
