import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PacienteEntity } from './paciente';
import { Repository } from 'typeorm';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find();
  }

  async findOne(id: number): Promise<PacienteEntity> {
    const savedPatient = await this.pacienteRepository.findOne({
      where: { id },
    });

    if (!savedPatient)
      throw new NotFoundException(`Paciente with id ${id} not found`);

    return savedPatient;
  }

  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    return await this.pacienteRepository.save(paciente);
  }

  async update(id: number, paciente: PacienteEntity): Promise<void> {
    const savedPatient = await this.findOne(id);
    await this.pacienteRepository.save({ ...savedPatient, ...paciente });
  }

  async delete(id: number): Promise<void> {
    const savedPatient = await this.findOne(id);
    await this.pacienteRepository.delete(savedPatient);
  }
}
