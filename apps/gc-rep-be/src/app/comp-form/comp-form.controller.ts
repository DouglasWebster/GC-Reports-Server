import { Controller, Get, Param } from '@nestjs/common';
import { CompFormService } from './comp-form.service';

@Controller('comp-form')
export class CompFormController {
    constructor(private readonly conpFormService: CompFormService) {}

    @Get()
    async getCompsForms() {
        return this.conpFormService.getCompsForms()
    }

    @Get(':id')
    async getCompForm(@Param('id') compFormId: string) {
        return this.conpFormService.getCompsForm(parseInt(compFormId));
    }
}
