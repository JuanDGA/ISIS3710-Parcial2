import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MedicoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  // @ManyToMany(() => Paciente, paciente)
  // pacientes: Paciente[];
}
