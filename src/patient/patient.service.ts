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
    private readonly patientRepository: Repository<PatientEntity>,
  ) {}

  async findAll(): Promise<PatientEntity[]> {
    return await this.patientRepository.find();
  }

  async findOne(
    id: number,
    withDetail: boolean = true,
  ): Promise<PatientEntity> {
    const savedPatient = await this.patientRepository.findOne({
      where: { id },
      relations: {
        doctors: withDetail,
        diagnoses: withDetail,
      },
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

    return await this.patientRepository.save(patient);
  }

  async update(id: number, patient: PatientEntity): Promise<PatientEntity> {
    if (patient.name.trim().length < 3)
      throw new BadRequestException(
        'The name of the patient must have at least 3 characters',
      );

    // The relations must not be modified from here
    delete patient.diagnoses;
    delete patient.doctors;

    const savedPatient = await this.findOne(id, false);
    return await this.patientRepository.save({ ...savedPatient, ...patient });
  }

  async delete(id: number): Promise<void> {
    const savedPatient = await this.findOne(id);

    if (savedPatient.diagnoses.length > 0)
      throw new BadRequestException(
        'Cannot delete a patient with associated diagnosis',
      );

    await this.patientRepository.remove(savedPatient);
  }
}
