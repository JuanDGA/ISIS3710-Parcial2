import { Module } from '@nestjs/common';
import { PatientDoctorService } from './patient-doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '../patient/patient';
import { DoctorEntity } from '../doctor/doctor';
import { PatientDoctorController } from './patient-doctor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, DoctorEntity])],
  providers: [PatientDoctorService],
  controllers: [PatientDoctorController],
})
export class PatientDoctorModule {}
