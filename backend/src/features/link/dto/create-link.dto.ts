import { IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @MaxLength(100)
  title: string;

  @IsUrl()
  url: string;
}
