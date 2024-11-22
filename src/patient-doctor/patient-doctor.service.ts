import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from '../patient/patient';
import { Repository } from 'typeorm';
import { DoctorEntity } from '../doctor/doctor';

@Injectable()
export class PatientDoctorService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
    @InjectRepository(DoctorEntity)
    private readonly doctorRepository: Repository<DoctorEntity>,
  ) {}

  async addDoctorToPatient(
    patientId: number,
    doctorId: number,
  ): Promise<PatientEntity> {
    const savedPatient = await this.patientRepository.findOne({
      where: { id: patientId },
    });

    if (!savedPatient)
      throw new NotFoundException(`Patient with id ${patientId} not found`);

    if (savedPatient.doctors.length >= 5)
      throw new BadRequestException(
        'The patient already has 5 associated doctors',
      );

    const savedDoctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!savedDoctor)
      throw new NotFoundException(`Doctor with id ${doctorId} not found`);

    savedDoctor.patients.push(savedPatient);
    savedPatient.doctors.push(savedDoctor);

    await this.doctorRepository.save(savedDoctor);
    return await this.patientRepository.save(savedPatient);
  }
}
