import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { faker } from '@faker-js/faker';
import { PatientEntity } from './patient';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMTestingConfig } from '../common/TypeORMTestingConfig';
import { BadRequestException } from '@nestjs/common';

describe('PatientService', () => {
  let service: PatientService;
  let repository: Repository<PatientEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMTestingConfig()],
      providers: [PatientService],
    }).compile();

    service = module.get<PatientService>(PatientService);
    repository = module.get<Repository<PatientEntity>>(
      getRepositoryToken(PatientEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Patient must be saved correctly', async () => {
    const patient: PatientEntity = {
      diagnosis: [],
      doctors: [],
      gender: faker.person.gender(),
      name: faker.person.fullName(),
      id: null,
    };

    const newPatient = await service.create(patient);
    expect(newPatient).not.toBeNull();

    const storedPatient = await repository.findOne({
      where: { id: newPatient.id },
    });
    expect(storedPatient).not.toBeNull();
    expect(storedPatient.id).toEqual(newPatient.id);
    expect(storedPatient.name).toEqual(newPatient.name);
    expect(storedPatient.gender).toEqual(newPatient.gender);
  });

  it('Cannot create Patient with short name', async () => {
    const patient: PatientEntity = {
      diagnosis: [],
      doctors: [],
      gender: faker.person.gender(),
      name: 'Sh',
      id: null,
    };

    await expect(() => service.create(patient)).rejects.toThrow(
      BadRequestException,
    );
  });
});
