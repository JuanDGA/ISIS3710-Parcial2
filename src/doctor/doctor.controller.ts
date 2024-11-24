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
import { DoctorDto, DoctorUpdateDto } from './doctor.dto';
import { plainToInstance } from 'class-transformer';

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
  async create(@Body() doctor: DoctorDto): Promise<DoctorEntity> {
    return await this.doctorService.create(
      plainToInstance(DoctorEntity, doctor),
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() doctor: DoctorUpdateDto,
  ): Promise<DoctorEntity> {
    return await this.doctorService.update(
      id,
      plainToInstance(DoctorEntity, doctor),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number): Promise<void> {
    await this.doctorService.delete(id);
  }
}
