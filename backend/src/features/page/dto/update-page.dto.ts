import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsUrl,
} from 'class-validator';

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'slug는 영문 소문자, 숫자, 하이픈, 언더스코어만 가능합니다',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
