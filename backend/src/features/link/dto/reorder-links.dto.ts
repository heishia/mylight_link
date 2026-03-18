import { IsArray, IsString } from 'class-validator';

export class ReorderLinksDto {
  @IsArray()
  @IsString({ each: true })
  linkIds: string[];
}
