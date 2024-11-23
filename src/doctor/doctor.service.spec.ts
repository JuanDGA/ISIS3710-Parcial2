import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctor.service';
import { TypeORMConfig } from '../common/TypeORMConfig';

describe('MedicoService', () => {
  let service: DoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMConfig()],
      providers: [DoctorService],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
