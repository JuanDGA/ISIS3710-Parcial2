import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DoctorEntity } from '../doctor/doctor';
import { DiagnosisEntity } from '../diagnosis/diagnosis';

@Entity()
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @ManyToMany(() => DoctorEntity, (doctor) => doctor.patients)
  @JoinTable()
  doctors: DoctorEntity[];

  @ManyToMany(() => DiagnosisEntity, (diagnosis) => diagnosis.patients)
  @JoinTable()
  diagnoses: DiagnosisEntity[];
}
