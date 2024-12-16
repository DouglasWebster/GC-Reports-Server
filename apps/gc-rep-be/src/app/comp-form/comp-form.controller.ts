import { Controller, Get, Param, Query } from '@nestjs/common';
import { CompFormService } from './comp-form.service';

@Controller('comp-form')
export class CompFormController {
    constructor(private readonly conpFormService: CompFormService) {}

    @Get(':id')
    async getCompForm(@Param('id') compFormId: string) {
        return this.conpFormService.getCompsForm(parseInt(compFormId));
    }

    @Get()
    async getCompFormIdFromName(@Query('format') format: string | undefined){
        if(format === undefined) return this.conpFormService.getCompsForms();
        return this.conpFormService.getCompFormIdFromName(format)
    }
    

}
