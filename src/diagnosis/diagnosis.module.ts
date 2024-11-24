import { Module } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosisEntity } from './diagnosis';
import { DiagnosisController } from './diagnosis.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosisEntity])],
  providers: [DiagnosisService],
  controllers: [DiagnosisController],
})
export class DiagnosisModule {}
