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
import { PatientService } from './patient.service';
import { PatientEntity } from './patient';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(): Promise<PatientEntity[]> {
    return await this.patientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PatientEntity> {
    return await this.patientService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() patient: PatientEntity): Promise<PatientEntity> {
    return await this.patientService.create(patient);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() patient: PatientEntity,
  ): Promise<PatientEntity> {
    return await this.patientService.update(id, patient);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.patientService.delete(id);
  }
}
