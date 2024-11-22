import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PatientEntity } from '../patient/patient';

@Entity()
export class DiagnosisEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @ManyToMany(() => PatientEntity)
  patients: PatientEntity[];
}
