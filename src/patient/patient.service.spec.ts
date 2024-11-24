import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { faker } from '@faker-js/faker';
import { PatientEntity } from './patient';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMConfig } from '../common/TypeORMConfig';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const generateRandomPatient = (): PatientEntity => {
  return {
    diagnoses: [],
    doctors: [],
    gender: faker.person.gender(),
    name: faker.person.fullName(),
    id: null,
  };
};

describe('PatientService', () => {
  let service: PatientService;
  let patientRepository: Repository<PatientEntity>;
  let randomPatients: PatientEntity[] = [];
  let randomPatientsById = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [PatientService],
    }).compile();

    service = module.get<PatientService>(PatientService);
    patientRepository = module.get<Repository<PatientEntity>>(
      getRepositoryToken(PatientEntity),
    );
    randomPatients = [];
    randomPatientsById = {};

    for (let i = 0; i < 5; i++) {
      const rand = generateRandomPatient();
      const saved = await patientRepository.save(rand);
      randomPatients.push(saved);
      randomPatientsById[saved.id] = saved;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return the correct list of patients', async () => {
      const savedPatients = await service.findAll();

      expect(savedPatients.length).toBe(randomPatients.length);

      for (let i = 0; i < randomPatients.length; i++) {
        const savedPatient = savedPatients[i];
        const expectedPatient = randomPatientsById[savedPatient.id];

        expect(savedPatient.name).toEqual(expectedPatient.name);
        expect(savedPatient.gender).toEqual(expectedPatient.gender);
        expect(savedPatient.doctors).toBeUndefined(); // The 'findAll' method should not provide detail
        expect(savedPatient.diagnoses).toBeUndefined(); // The 'findAll' method should not provide detail
      }
    });
  });

  describe('findOne()', () => {
    it('should return the correct patient with detail', async () => {
      for (const expectedPatient of randomPatients) {
        const savedPatient = await service.findOne(expectedPatient.id);

        expect(savedPatient).not.toBeNull();
        expect(savedPatient.name).toEqual(expectedPatient.name);
        expect(savedPatient.gender).toEqual(expectedPatient.gender);
        expect(savedPatient.doctors).toEqual(expectedPatient.doctors);
        expect(savedPatient.diagnoses).toEqual(expectedPatient.diagnoses);
      }
    });

    it('should return the correct patient without detail if specified', async () => {
      for (const expectedPatient of randomPatients) {
        const savedPatient = await service.findOne(expectedPatient.id, false);

        expect(savedPatient).not.toBeNull();
        expect(savedPatient.name).toEqual(expectedPatient.name);
        expect(savedPatient.gender).toEqual(expectedPatient.gender);
        expect(savedPatient.doctors).toBeUndefined();
        expect(savedPatient.diagnoses).toBeUndefined();
      }
    });

    it('should throw exception if the patient does not exist', async () => {
      await expect(() => service.findOne(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create()', () => {
    it('Patient must be saved correctly', async () => {
      const patient: PatientEntity = generateRandomPatient();

      const newPatient = await service.create(patient);
      expect(newPatient).not.toBeNull();

      const storedPatient = await patientRepository.findOne({
        where: { id: newPatient.id },
      });
      expect(storedPatient).not.toBeNull();
      expect(storedPatient.id).toEqual(newPatient.id);
      expect(storedPatient.name).toEqual(newPatient.name);
      expect(storedPatient.gender).toEqual(newPatient.gender);
    });

    it('Cannot create Patient with short name', async () => {
      const patient: PatientEntity = { ...generateRandomPatient(), name: 'TW' };

      await expect(() => service.create(patient)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update()', () => {
    it('Patient must be updated correctly', async () => {
      const patient = { ...randomPatients[0], name: 'Updated' };

      const updated = await service.update(patient.id, patient);

      expect(updated).not.toBeNull();
      for (const key in updated) {
        expect(updated[key]).toEqual(patient[key]);
      }
    });

    it('cannot update patient with short name.', async () => {
      const patient = { ...randomPatients[0], name: 'TW' };

      await expect(() => service.update(patient.id, patient)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Should throw NotFoundException when trying to update an non-existent patient', async () => {
      const patient = { ...randomPatients[0], name: 'Updated' };

      await expect(() => service.update(-1, patient)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete()', () => {
    it('Patient must be deleted correctly', async () => {
      const toDelete = randomPatients[0];

      // We should not use any service method apart from 'delete'
      expect(
        await patientRepository.findOne({ where: { id: toDelete.id } }),
      ).not.toBeNull();

      await service.delete(toDelete.id);

      // We should not use any service method apart from 'delete'
      expect(
        await patientRepository.findOne({ where: { id: toDelete.id } }),
      ).toBeNull();
    });

    it('Should throw an exception if trying to delete an non-existent patient', async () => {
      await expect(() => service.delete(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
