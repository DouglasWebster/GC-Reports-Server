import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { FeatureHealthController } from './feature-health.controller';

@Module({
  imports: [TerminusModule],
  controllers: [FeatureHealthController],
  providers: [],
  exports: [],
})
export class FeatureHealthModule {}
