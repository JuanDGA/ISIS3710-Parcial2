import { Test, TestingModule } from '@nestjs/testing';
import { PatientDoctorService } from './patient-doctor.service';
import { TypeORMConfig } from '../common/TypeORMConfig';

describe('PatientDoctorService', () => {
  let service: PatientDoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [PatientDoctorService],
    }).compile();

    service = module.get<PatientDoctorService>(PatientDoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
