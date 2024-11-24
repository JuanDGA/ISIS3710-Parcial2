import { IsNotEmpty, IsString } from 'class-validator';

export class DiagnosisDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}

export class DiagnosisUpdateDto {
  readonly name: string;
  readonly description: string;
}
