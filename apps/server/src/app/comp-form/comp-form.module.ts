import { Module } from '@nestjs/common';
import { CompFormService } from './comp-form.service';
import { CompFormController } from './comp-form.controller';
import { TeeModule } from '../tee/tee.module';

@Module({
  imports: [TeeModule],
  providers: [CompFormService],
  controllers: [CompFormController],
  exports: [CompFormService],
})
export class CompFormModule {}
