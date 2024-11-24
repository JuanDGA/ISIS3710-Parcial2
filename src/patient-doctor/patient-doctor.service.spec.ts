import { Test, TestingModule } from '@nestjs/testing';
import { PatientDoctorService } from './patient-doctor.service';
import { TypeORMConfig } from '../common/TypeORMConfig';
import { Repository } from 'typeorm';
import { PatientEntity } from '../patient/patient';
import { DoctorEntity } from '../doctor/doctor';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateRandomDoctor } from '../doctor/doctor.service.spec';
import { generateRandomPatient } from '../patient/patient.service.spec';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PatientDoctorService', () => {
  let service: PatientDoctorService;
  let doctorRepository: Repository<DoctorEntity>;
  let patientRepository: Repository<PatientEntity>;

  let randomDoctors: DoctorEntity[];
  let randomPatients: PatientEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [PatientDoctorService],
    }).compile();

    service = module.get<PatientDoctorService>(PatientDoctorService);
    doctorRepository = module.get<Repository<DoctorEntity>>(
      getRepositoryToken(DoctorEntity),
    );
    patientRepository = module.get<Repository<PatientEntity>>(
      getRepositoryToken(PatientEntity),
    );

    randomDoctors = [];
    randomPatients = [];

    for (let i = 0; i < 6; i++) {
      const randomDoctor = generateRandomDoctor();
      const savedDoctor = await doctorRepository.save(randomDoctor);
      randomDoctors.push(savedDoctor);
    }

    for (let i = 0; i < 5; i++) {
      const randomPatient = generateRandomPatient();
      const savedPatient = await patientRepository.save(randomPatient);
      randomPatients.push(savedPatient);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addDoctorToPatient', () => {
    it('Should add the correct doctor and correct patient to each entity', async () => {
      let doctor = await doctorRepository.findOne({
        where: { id: randomDoctors[0].id },
        relations: { patients: true },
      });
      let patient = await patientRepository.findOne({
        where: { id: randomPatients[0].id },
        relations: { doctors: true },
      });

      expect(doctor.patients.length).toBe(0);
      expect(patient.doctors.length).toBe(0);

      await service.addDoctorToPatient(patient.id, doctor.id);

      doctor = await doctorRepository.findOne({
        where: { id: doctor.id },
        relations: { patients: true },
      });
      patient = await patientRepository.findOne({
        where: { id: randomPatients[0].id },
        relations: { doctors: true },
      });

      expect(doctor.patients.length).toBe(1);
      expect(patient.doctors.length).toBe(1);

      expect(doctor.patients[0].id).toBe(patient.id);
      expect(patient.doctors[0].id).toBe(doctor.id);
    });

    it('Should fail if the doctor does not exist', async () => {
      await expect(() =>
        service.addDoctorToPatient(randomPatients[0].id, -1),
      ).rejects.toThrow(NotFoundException);
    });

    it('Should fail if the patient does not exist', async () => {
      await expect(() =>
        service.addDoctorToPatient(-1, randomDoctors[0].id),
      ).rejects.toThrow(NotFoundException);
    });

    it('Cannot add more than five doctors to a patient', async () => {
      let patient = await patientRepository.findOne({
        where: { id: randomPatients[0].id },
        relations: { doctors: true },
      });

      expect(patient.doctors.length).toBe(0);

      for (let i = 0; i < 5; i++)
        await service.addDoctorToPatient(patient.id, randomDoctors[i].id);

      patient = await patientRepository.findOne({
        where: { id: patient.id },
        relations: { doctors: true },
      });

      expect(patient.doctors.length).toBe(5);

      await expect(() =>
        service.addDoctorToPatient(patient.id, randomDoctors[5].id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
