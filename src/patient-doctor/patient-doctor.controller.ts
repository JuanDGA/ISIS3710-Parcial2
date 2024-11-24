import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { PatientDoctorService } from './patient-doctor.service';

@Controller('patients')
export class PatientDoctorController {
  constructor(private readonly patientDoctorService: PatientDoctorService) {}

  @Post(':patientId/doctors/:doctorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addDoctorToPatient(
    @Param('patientId') patientId: number,
    @Param('doctorId') doctorId: number,
  ): Promise<void> {
    await this.patientDoctorService.addDoctorToPatient(patientId, doctorId);
  }
}
