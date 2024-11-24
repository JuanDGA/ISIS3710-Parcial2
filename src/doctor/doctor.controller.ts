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
import { DoctorService } from './doctor.service';
import { DoctorEntity } from './doctor';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(): Promise<DoctorEntity[]> {
    return await this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<DoctorEntity> {
    return await this.doctorService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() patient: DoctorEntity): Promise<DoctorEntity> {
    return await this.doctorService.create(patient);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() patient: DoctorEntity,
  ): Promise<DoctorEntity> {
    return await this.doctorService.update(id, patient);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.doctorService.delete(id);
  }
}
