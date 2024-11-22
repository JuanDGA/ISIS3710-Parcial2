import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosticoEntity } from './diagnostico';
import { Repository } from 'typeorm';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  async findOne(id: number): Promise<DiagnosticoEntity> {
    const savedDiagnosis = this.diagnosticoRepository.findOne({
      where: { id },
    });

    if (!savedDiagnosis)
      throw new NotFoundException(`Diagnosis with ${id} not found`);

    return savedDiagnosis;
  }

  async create(diagnosis: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    return await this.diagnosticoRepository.save(diagnosis);
  }

  async update(
    id: number,
    diagnosis: DiagnosticoEntity,
  ): Promise<DiagnosticoEntity> {
    const savedDiagnosis = await this.findOne(id);

    return this.diagnosticoRepository.save({ ...savedDiagnosis, ...diagnosis });
  }

  async delete(id: number): Promise<void> {
    const savedDiagnosis = await this.findOne(id);
    await this.diagnosticoRepository.delete(savedDiagnosis);
  }
}
