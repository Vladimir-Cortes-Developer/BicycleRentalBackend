import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsEnum(['Point'], { message: 'Location type must be "Point"' })
  @IsNotEmpty({ message: 'Location type is required' })
  type!: 'Point';

  @IsArray({ message: 'Coordinates must be an array' })
  @ArrayMinSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @ArrayMaxSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @IsNumber({}, { each: true, message: 'Each coordinate must be a number' })
  coordinates!: [number, number];
}

export class CreateEventDto {
  @IsString({ message: 'Event name must be a string' })
  @IsNotEmpty({ message: 'Event name is required' })
  @MaxLength(200, { message: 'Event name must not exceed 200 characters' })
  eventName!: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description!: string;

  @Type(() => Date)
  @IsDate({ message: 'Event date must be a valid date' })
  @IsNotEmpty({ message: 'Event date is required' })
  eventDate!: Date;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty({ message: 'Start location is required' })
  startLocation!: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  endLocation?: LocationDto;

  @IsNumber({}, { message: 'Distance must be a number' })
  @IsOptional()
  @Min(0, { message: 'Distance must be a positive number' })
  distance?: number;

  @IsNumber({}, { message: 'Max participants must be a number' })
  @IsOptional()
  @Min(1, { message: 'Max participants must be at least 1' })
  maxParticipants?: number;

  @IsMongoId({ message: 'Regional ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Regional ID is required' })
  regionalId!: string;
}
