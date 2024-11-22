import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoctorModule } from './doctor/doctor.module';
import { PatientModule } from './patient/patient.module';
import { DiagnosisModule } from './diagnosis/diagnosis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisEntity } from './diagnosis/diagnosis';
import { DoctorEntity } from './doctor/doctor';
import { PatientEntity } from './patient/patient';
import { PatientDoctorService } from './patient-doctor/patient-doctor.service';
import { PatientDoctorModule } from './patient-doctor/patient-doctor.module';

@Module({
  imports: [
    DoctorModule,
    PatientModule,
    DiagnosisModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [DiagnosisEntity, DoctorEntity, PatientEntity],
      synchronize: true,
      keepConnectionAlive: true,
    }),
    PatientDoctorModule,
  ],
  controllers: [AppController],
  providers: [AppService, PatientDoctorService],
})
export class AppModule {}
