import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico';
import { Repository } from 'typeorm';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find();
  }

  async findOne(id: number): Promise<MedicoEntity> {
    const medico = this.medicoRepository.findOne({
      where: { id },
    });

    if (!medico) throw new NotFoundException(`Medico with id ${id} not found`);

    return medico;
  }

  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    return await this.medicoRepository.save(medico);
  }

  async update(id: number, medico: MedicoEntity): Promise<MedicoEntity> {
    const savedDoctor = await this.findOne(id);

    return await this.medicoRepository.save({ ...savedDoctor, ...medico });
  }

  async delete(id: number): Promise<void> {
    const savedDoctor = await this.findOne(id);

    await this.medicoRepository.delete(savedDoctor.id);
  }
}
