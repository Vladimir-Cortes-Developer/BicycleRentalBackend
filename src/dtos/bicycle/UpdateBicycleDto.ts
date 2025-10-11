import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
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

export class UpdateBicycleDto {
  @IsString({ message: 'Code must be a string' })
  @IsOptional()
  @MaxLength(20, { message: 'Code must not exceed 20 characters' })
  code?: string;

  @IsString({ message: 'Brand must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Brand must not exceed 100 characters' })
  brand?: string;

  @IsString({ message: 'Bicycle model must be a string' })
  @IsOptional()
  @MaxLength(100, { message: 'Bicycle model must not exceed 100 characters' })
  bicycleModel?: string;

  @IsEnum(['mountain', 'road', 'hybrid', 'electric'], {
    message: 'Bicycle type must be one of: mountain, road, hybrid, electric',
  })
  @IsOptional()
  bicycleType?: 'mountain' | 'road' | 'hybrid' | 'electric';

  @IsEnum(['available', 'rented', 'maintenance', 'retired'], {
    message: 'Status must be one of: available, rented, maintenance, retired',
  })
  @IsOptional()
  status?: 'available' | 'rented' | 'maintenance' | 'retired';

  @IsNumber({}, { message: 'Rental price per hour must be a number' })
  @IsOptional()
  @Min(0, { message: 'Rental price per hour must be a positive number' })
  rentalPricePerHour?: number;

  @IsMongoId({ message: 'Regional ID must be a valid MongoDB ObjectId' })
  @IsOptional()
  regionalId?: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  currentLocation?: LocationDto;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}
