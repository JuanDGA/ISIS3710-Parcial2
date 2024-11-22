import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisEntity } from './diagnosis';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosisEntity])],
  providers: [DiagnosisService],
})
export class DiagnosisModule {}
