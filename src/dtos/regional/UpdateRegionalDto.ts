import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsEnum(['Point'], { message: 'Location type must be "Point"' })
  type!: 'Point';

  @IsArray({ message: 'Coordinates must be an array' })
  @ArrayMinSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @ArrayMaxSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @IsNumber({}, { each: true, message: 'Each coordinate must be a number' })
  coordinates!: [number, number];
}

export class UpdateRegionalDto {
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  @MaxLength(150, { message: 'Regional name must not exceed 150 characters' })
  name?: string;

  @IsString({ message: 'City must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @IsString({ message: 'Department must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Department must not exceed 100 characters' })
  department?: string;

  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  @MaxLength(255, { message: 'Address must not exceed 255 characters' })
  address?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;
}