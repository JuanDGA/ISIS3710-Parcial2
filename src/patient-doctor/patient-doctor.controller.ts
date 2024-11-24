import { Controller, Param, Put } from '@nestjs/common';
import { PatientDoctorService } from './patient-doctor.service';

@Controller('patients')
export class PatientDoctorController {
  constructor(private readonly patientDoctorService: PatientDoctorService) {}

  @Put(':patientId/doctors/:doctorId')
  async addDoctorToPatient(
    @Param('patientId') patientId: number,
    @Param('doctorId') doctorId: number,
  ): Promise<void> {
    await this.patientDoctorService.addDoctorToPatient(patientId, doctorId);
  }
}
