import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientEntity } from '../patient/patient';

@Entity()
export class DiagnosisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => PatientEntity, (patient) => patient.diagnoses)
  patients: PatientEntity[];
}
