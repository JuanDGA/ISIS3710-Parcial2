import { IsNotEmpty, IsString } from 'class-validator';

export class DoctorDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly speciality: string;

  @IsString()
  @IsNotEmpty()
  readonly phone: string;
}

export class DoctorUpdateDto {
  readonly name: string;
  readonly speciality: string;
  readonly phone: string;
}
