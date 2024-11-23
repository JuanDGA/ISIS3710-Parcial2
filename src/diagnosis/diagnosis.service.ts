import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiagnosisEntity } from './diagnosis';
import { Repository } from 'typeorm';

@Injectable()
export class DiagnosisService {
  constructor(
    @InjectRepository(DiagnosisEntity)
    private readonly diagnosisRepository: Repository<DiagnosisEntity>,
  ) {}

  async findAll(): Promise<DiagnosisEntity[]> {
    return await this.diagnosisRepository.find();
  }

  async findOne(
    id: number,
    withDetail: boolean = true,
  ): Promise<DiagnosisEntity> {
    const savedDiagnosis = this.diagnosisRepository.findOne({
      where: { id },
      relations: {
        patients: withDetail,
      },
    });

    if (!savedDiagnosis)
      throw new NotFoundException(`Diagnosis with ${id} not found`);

    return savedDiagnosis;
  }

  async create(diagnosis: DiagnosisEntity): Promise<DiagnosisEntity> {
    if (diagnosis.descripcion.trim().length > 200)
      throw new BadRequestException(
        'The description maximum length is 200 characters.',
      );
    return await this.diagnosisRepository.save(diagnosis);
  }

  async update(
    id: number,
    diagnosis: DiagnosisEntity,
  ): Promise<DiagnosisEntity> {
    const savedDiagnosis = await this.findOne(id, false);

    return this.diagnosisRepository.save({ ...savedDiagnosis, ...diagnosis });
  }

  async delete(id: number): Promise<void> {
    const savedDiagnosis = await this.findOne(id);
    await this.diagnosisRepository.remove(savedDiagnosis);
  }
}
