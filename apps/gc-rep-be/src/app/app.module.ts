import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TeeModule } from './tee/tee.module';
import { CompFormModule } from './comp-form/comp-form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TeeModule,
    CompFormModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
