import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor';
import { DoctorController } from './doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity])],
  providers: [DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
