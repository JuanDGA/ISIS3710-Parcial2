import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientEntity } from '../patient/patient';

@Entity()
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  speciality: string;

  @Column()
  phone: string;

  @ManyToMany(() => PatientEntity, (patient) => patient.doctors)
  patients: PatientEntity[];
}
