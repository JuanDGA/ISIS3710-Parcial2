import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { PatientDoctorModule } from './patient-doctor/patient-doctor.module';
import { TypeORMConfig } from './common/TypeORMConfig';

@Module({
  imports: [
    DoctorModule,
    PatientModule,
    DiagnosisModule,
    PatientDoctorModule,
    ...TypeORMConfig(),
  ],
})
export class AppModule {}
