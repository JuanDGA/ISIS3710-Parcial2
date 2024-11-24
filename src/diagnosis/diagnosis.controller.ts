import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { DiagnosisEntity } from './diagnosis';

@Controller('diagnoses')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get()
  async findAll(): Promise<DiagnosisEntity[]> {
    return await this.diagnosisService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DiagnosisEntity> {
    return await this.diagnosisService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() patient: DiagnosisEntity): Promise<DiagnosisEntity> {
    return await this.diagnosisService.create(patient);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() patient: DiagnosisEntity,
  ): Promise<DiagnosisEntity> {
    return await this.diagnosisService.update(id, patient);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.diagnosisService.delete(id);
  }
}