import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
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

  @ManyToMany(() => DoctorEntity)
  doctors: DoctorEntity[];

  @ManyToMany(() => DiagnosisEntity)
  diagnosis: DiagnosisEntity[];
}
