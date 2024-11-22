import { Module } from '@nestjs/common';
import { PatientDoctorService } from './patient-doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '../patient/patient';
import { DoctorEntity } from '../doctor/doctor';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, DoctorEntity])],
  providers: [PatientDoctorService],
})
export class PatientDoctorModule {}
