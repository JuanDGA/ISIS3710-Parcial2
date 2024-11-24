import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeORMConfig } from '../common/TypeORMConfig';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorEntity } from './doctor';

const generateRandomDoctor = (): DoctorEntity => {
  return {
    patients: [],
    name: faker.person.fullName(),
    speciality: faker.helpers.arrayElement(['Cardiologist', 'Dermatologist']),
    phone: faker.phone.number(),
    id: null,
  };
};

describe('DoctorService', () => {
  let service: DoctorService;
  let doctorRepository: Repository<DoctorEntity>;
  let randomDoctors: DoctorEntity[] = [];
  let randomDoctorsById = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [DoctorService],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    doctorRepository = module.get<Repository<DoctorEntity>>(
      getRepositoryToken(DoctorEntity),
    );
    randomDoctors = [];
    randomDoctorsById = {};

    for (let i = 0; i < 5; i++) {
      const rand = generateRandomDoctor();
      const saved = await doctorRepository.save(rand);
      randomDoctors.push(saved);
      randomDoctorsById[saved.id] = saved;
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll()', () => {
    it('should return the correct list of doctors', async () => {
      const savedDoctors = await service.findAll();

      expect(savedDoctors.length).toBe(randomDoctors.length);

      for (let i = 0; i < randomDoctors.length; i++) {
        const savedDoctor = savedDoctors[i];
        const expectedDoctor: DoctorEntity = randomDoctorsById[savedDoctor.id];

        expect(savedDoctor.name).toEqual(expectedDoctor.name);
        expect(savedDoctor.speciality).toEqual(expectedDoctor.speciality);
        expect(savedDoctor.phone).toEqual(expectedDoctor.phone);
        expect(savedDoctor.patients).toBeUndefined(); // The 'findAll' method should not provide detail
      }
    });
  });

  describe('findOne()', () => {
    it('should return the correct doctor with detail', async () => {
      for (const expectedDoctor of randomDoctors) {
        const savedDoctor = await service.findOne(expectedDoctor.id);

        expect(savedDoctor).not.toBeNull();
        expect(savedDoctor.name).toEqual(expectedDoctor.name);
        expect(savedDoctor.speciality).toEqual(expectedDoctor.speciality);
        expect(savedDoctor.phone).toEqual(expectedDoctor.phone);
        expect(savedDoctor.patients).toEqual(expectedDoctor.patients);
      }
    });

    it('should return the correct doctor without detail if specified', async () => {
      for (const expectedDoctor of randomDoctors) {
        const savedDoctor = await service.findOne(expectedDoctor.id, false);

        expect(savedDoctor).not.toBeNull();
        expect(savedDoctor.name).toEqual(expectedDoctor.name);
        expect(savedDoctor.speciality).toEqual(expectedDoctor.speciality);
        expect(savedDoctor.phone).toEqual(expectedDoctor.phone);
        expect(savedDoctor.patients).toBeUndefined();
      }
    });

    it('should throw exception if the doctor does not exist', async () => {
      await expect(() => service.findOne(-1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create()', () => {
    it('Doctor must be saved correctly', async () => {
      const doctor: DoctorEntity = generateRandomDoctor();

      const newDoctor = await service.create(doctor);
      expect(newDoctor).not.toBeNull();

      const storedDoctor = await doctorRepository.findOne({
        where: { id: newDoctor.id },
      });
      expect(storedDoctor).not.toBeNull();
      expect(storedDoctor.id).toEqual(newDoctor.id);
      expect(storedDoctor.name).toEqual(newDoctor.name);
      expect(storedDoctor.speciality).toEqual(newDoctor.speciality);
      expect(storedDoctor.phone).toEqual(newDoctor.phone);
    });

    it('Cannot create Doctor without name', async () => {
      const doctor: DoctorEntity = { ...generateRandomDoctor(), name: '' };

      await expect(() => service.create(doctor)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Cannot create Doctor without speciality', async () => {
      const doctor: DoctorEntity = {
        ...generateRandomDoctor(),
        speciality: '',
      };

      await expect(() => service.create(doctor)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update()', () => {
    it('Doctor must be updated correctly', async () => {
      const doctor = { ...randomDoctors[0], name: 'Updated' };

      const updated = await service.update(doctor.id, doctor);

      expect(updated).not.toBeNull();
      for (const key in updated) {
        expect(updated[key]).toEqual(doctor[key]);
      }
    });

    it('Cannot update doctor without name.', async () => {
      const doctor = { ...randomDoctors[0], name: '' };

      await expect(() => service.update(doctor.id, doctor)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Cannot update doctor without speciality.', async () => {
      const doctor = { ...randomDoctors[0], speciality: '' };

      await expect(() => service.update(doctor.id, doctor)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Should throw NotFoundException when trying to update an non-existent doctor', async () => {
      const doctor = { ...randomDoctors[0], name: 'Updated' };

      await expect(() => service.update(-1, doctor)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete()', () => {
    it('Doctor must be deleted correctly', async () => {
      const toDelete = randomDoctors[0];

      // We should not use any service method apart from 'delete'
      expect(
        await doctorRepository.findOne({ where: { id: toDelete.id } }),
      ).not.toBeNull();

      await service.delete(toDelete.id);

      // We should not use any service method apart from 'delete'
      expect(
        await doctorRepository.findOne({ where: { id: toDelete.id } }),
      ).toBeNull();
    });

    it('Should throw an exception if trying to delete an non-existent doctor', async () => {
      await expect(() => service.delete(-1)).rejects.toThrow(NotFoundException);
    });
  });
});
