import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMConfig } from '../common/TypeORMConfig';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DiagnosisEntity } from './diagnosis';
import { DiagnosisService } from './diagnosis.service';

const generateRandomDiagnosis = (): DiagnosisEntity => {
  let description = faker.lorem.paragraph();
  if (description.length > 200) description = description.slice(0, 200);
  return {
    patients: [],
    name: faker.person.fullName(),
    description,
    id: null,
  };
};

describe('DiagnosisService', () => {
  let service: DiagnosisService;
  let diagnosisRepository: Repository<DiagnosisEntity>;
  let randomDiagnoses: DiagnosisEntity[] = [];
  let randomDiagnosesById = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [DiagnosisService],
    }).compile();

    service = module.get<DiagnosisService>(DiagnosisService);
    diagnosisRepository = module.get<Repository<DiagnosisEntity>>(
      getRepositoryToken(DiagnosisEntity),
    );
    randomDiagnoses = [];
    randomDiagnosesById = {};

    for (let i = 0; i < 5; i++) {
      const rand = generateRandomDiagnosis();
      const saved = await diagnosisRepository.save(rand);
      randomDiagnoses.push(saved);
      randomDiagnosesById[saved.id] = saved;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return the correct list of diagnoses', async () => {
      const savedDiagnoses = await service.findAll();

      expect(savedDiagnoses.length).toBe(randomDiagnoses.length);

      for (let i = 0; i < randomDiagnoses.length; i++) {
        const savedDiagnosis = savedDiagnoses[i];
        const expectedDiagnosis: DiagnosisEntity =
          randomDiagnosesById[savedDiagnosis.id];

        expect(savedDiagnosis.name).toEqual(expectedDiagnosis.name);
        expect(savedDiagnosis.description).toEqual(
          expectedDiagnosis.description,
        );
        expect(savedDiagnosis.patients).toBeUndefined(); // The 'findAll' method should not provide detail
      }
    });
  });

  describe('findOne()', () => {
    it('should return the correct diagnosis with detail', async () => {
      for (const expectedDiagnosis of randomDiagnoses) {
        const savedDiagnosis = await service.findOne(expectedDiagnosis.id);

        expect(savedDiagnosis).not.toBeNull();
        expect(savedDiagnosis.name).toEqual(expectedDiagnosis.name);
        expect(savedDiagnosis.description).toEqual(
          expectedDiagnosis.description,
        );
        expect(savedDiagnosis.patients).toEqual(expectedDiagnosis.patients);
      }
    });

    it('should return the correct diagnosis without detail if specified', async () => {
      for (const expectedDiagnosis of randomDiagnoses) {
        const savedDiagnosis = await service.findOne(
          expectedDiagnosis.id,
          false,
        );

        expect(savedDiagnosis).not.toBeNull();
        expect(savedDiagnosis.name).toEqual(expectedDiagnosis.name);
        expect(savedDiagnosis.description).toEqual(
          expectedDiagnosis.description,
        );
        expect(savedDiagnosis.patients).toBeUndefined();
      }
    });

    it('should throw an exception if the diagnosis does not exist', async () => {
      await expect(() => service.findOne(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create()', () => {
    it('Diagnosis must be saved correctly', async () => {
      const diagnosis: DiagnosisEntity = generateRandomDiagnosis();

      const newDiagnosis = await service.create(diagnosis);
      expect(newDiagnosis).not.toBeNull();

      const storedDiagnosis = await diagnosisRepository.findOne({
        where: { id: newDiagnosis.id },
      });
      expect(storedDiagnosis).not.toBeNull();
      expect(storedDiagnosis.id).toEqual(newDiagnosis.id);
      expect(storedDiagnosis.name).toEqual(newDiagnosis.name);
      expect(storedDiagnosis.description).toEqual(newDiagnosis.description);
    });

    it('Cannot create Diagnosis with more than 200 characters in the description', async () => {
      const diagnosis: DiagnosisEntity = {
        ...generateRandomDiagnosis(),
        description: '.'.repeat(201),
      };

      await expect(() => service.create(diagnosis)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update()', () => {
    it('Diagnosis must be updated correctly', async () => {
      const diagnosis = { ...randomDiagnoses[0], name: 'Updated' };

      const updated = await service.update(diagnosis.id, diagnosis);

      expect(updated).not.toBeNull();
      for (const key in updated) {
        expect(updated[key]).toEqual(diagnosis[key]);
      }
    });

    it('Cannot update diagnosis with a description with more than 200 characters.', async () => {
      const diagnosis = { ...randomDiagnoses[0], description: '.'.repeat(201) };

      await expect(() =>
        service.update(diagnosis.id, diagnosis),
      ).rejects.toThrow(BadRequestException);
    });

    it('Should throw NotFoundException when trying to update an non-existent diagnosis', async () => {
      const diagnosis = { ...randomDiagnoses[0], name: 'Updated' };

      await expect(() => service.update(-1, diagnosis)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete()', () => {
    it('Diagnosis must be deleted correctly', async () => {
      const toDelete = randomDiagnoses[0];

      // We should not use any service method apart from 'delete'
      expect(
        await diagnosisRepository.findOne({ where: { id: toDelete.id } }),
      ).not.toBeNull();

      await service.delete(toDelete.id);

      // We should not use any service method apart from 'delete'
      expect(
        await diagnosisRepository.findOne({ where: { id: toDelete.id } }),
      ).toBeNull();
    });

    it('Should throw an exception if trying to delete an non-existent diagnosis', async () => {
      await expect(() => service.delete(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
