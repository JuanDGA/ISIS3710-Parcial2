import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisEntity } from '../diagnosis/diagnosis';
import { DoctorEntity } from '../doctor/doctor';
import { PatientEntity } from '../patient/patient';

export const TypeORMConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [DiagnosisEntity, DoctorEntity, PatientEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([PatientEntity, DoctorEntity, DiagnosisEntity]),
];
