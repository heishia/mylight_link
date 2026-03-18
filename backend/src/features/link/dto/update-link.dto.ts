import { IsOptional, IsString, IsUrl, IsBoolean, MaxLength } from 'class-validator';

export class UpdateLinkDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
