import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PacienteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  genero: string;
}
