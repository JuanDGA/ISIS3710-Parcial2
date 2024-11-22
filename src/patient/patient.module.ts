import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from './patient';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  providers: [PatientService],
})
export class PatientModule {}
