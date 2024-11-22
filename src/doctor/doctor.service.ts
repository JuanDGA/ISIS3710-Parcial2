import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorEntity } from './doctor';
import { Repository } from 'typeorm';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  async findAll(): Promise<DoctorEntity[]> {
    return await this.doctorRepository.find();
  }

  async findOne(id: number): Promise<DoctorEntity> {
    const medico = this.doctorRepository.findOne({
      where: { id },
    });

    if (!medico) throw new NotFoundException(`Medico with id ${id} not found`);

    return medico;
  }

  async create(doctor: DoctorEntity): Promise<DoctorEntity> {
    if (doctor.name.trim().length == 0)
      throw new BadRequestException('The name of the doctor cannot be empty');

    if (doctor.speciality.trim().length == 0)
      throw new BadRequestException(
        'The speciality of the doctor cannot be empty',
      );

    return await this.doctorRepository.save(doctor);
  }

  async update(id: number, medico: DoctorEntity): Promise<DoctorEntity> {
    const savedDoctor = await this.findOne(id);

    return await this.doctorRepository.save({ ...savedDoctor, ...medico });
  }

  async delete(id: number): Promise<void> {
    const savedDoctor = await this.findOne(id);

    if (savedDoctor.patients.length > 0)
      throw new BadRequestException(
        'Cannot delete a doctor with associated patients',
      );
    await this.doctorRepository.delete(savedDoctor.id);
  }
}
