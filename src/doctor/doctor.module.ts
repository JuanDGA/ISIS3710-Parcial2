import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor';

@Module({
  imports: [TypeOrmModule.forFeature([DoctorEntity])],
  providers: [DoctorService],
})
export class DoctorModule {}
