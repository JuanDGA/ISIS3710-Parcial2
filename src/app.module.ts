import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { PatientDoctorService } from './patient-doctor/patient-doctor.service';
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
  controllers: [AppController],
  providers: [AppService, PatientDoctorService],
})
export class AppModule {}
