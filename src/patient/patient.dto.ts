import { IsNotEmpty, IsString } from 'class-validator';

export class PatientDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;
}

export class PatientUpdateDto {
  readonly name: string;
  readonly gender: string;
}
