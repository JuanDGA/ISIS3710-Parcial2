import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from './patient';
import { Repository } from 'typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patient: Repository<PatientEntity>,
  ) {}

  async findAll(): Promise<PatientEntity[]> {
    return await this.patient.find();
  }

  async findOne(id: number): Promise<PatientEntity> {
    const savedPatient = await this.patient.findOne({
      where: { id },
    });

    if (!savedPatient)
      throw new NotFoundException(`Patient with id ${id} not found`);

    return savedPatient;
  }

  async create(patient: PatientEntity): Promise<PatientEntity> {
    if (patient.name.trim().length < 3)
      throw new BadRequestException(
        'The name of the patient must have at least 3 characters',
      );

    return await this.patient.save(patient);
  }

  async update(id: number, patient: PatientEntity): Promise<void> {
    const savedPatient = await this.findOne(id);
    await this.patient.save({ ...savedPatient, ...patient });
  }

  async delete(id: number): Promise<void> {
    const savedPatient = await this.findOne(id);

    if (savedPatient.diagnosis.length > 0)
      throw new BadRequestException(
        'Cannot delete a patient with associated diagnosis',
      );

    await this.patient.delete(savedPatient);
  }
}