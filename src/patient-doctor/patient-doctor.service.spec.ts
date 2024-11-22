import { Test, TestingModule } from '@nestjs/testing';
import { PatientDoctorService } from './patient-doctor.service';

describe('PatientDoctorService', () => {
  let service: PatientDoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientDoctorService],
    }).compile();

    service = module.get<PatientDoctorService>(PatientDoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
