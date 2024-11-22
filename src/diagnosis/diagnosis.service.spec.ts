import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosisService } from './diagnosis.service';
import { TypeORMTestingConfig } from '../common/TypeORMTestingConfig';

describe('DiagnosisService', () => {
  let service: DiagnosisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeORMTestingConfig()],
      providers: [DiagnosisService],
    }).compile();

    service = module.get<DiagnosisService>(DiagnosisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
