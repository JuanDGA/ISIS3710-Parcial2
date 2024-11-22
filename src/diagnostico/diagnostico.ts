import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DiagnosticoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;
}
