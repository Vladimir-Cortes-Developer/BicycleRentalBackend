import {
  IsDate,
  IsMongoId,
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
  type!: 'Point';

  @IsArray({ message: 'Coordinates must be an array' })
  @ArrayMinSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @ArrayMaxSize(2, { message: 'Coordinates must have exactly 2 elements [longitude, latitude]' })
  @IsNumber({}, { each: true, message: 'Each coordinate must be a number' })
  coordinates!: [number, number];
}

export class UpdateEventDto {
  @IsString({ message: 'Event name must be a string' })
  @IsOptional()
  @MaxLength(200, { message: 'Event name must not exceed 200 characters' })
  eventName?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @Type(() => Date)
  @IsDate({ message: 'Event date must be a valid date' })
  @IsOptional()
  eventDate?: Date;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  startLocation?: LocationDto;

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
  @IsOptional()
  regionalId?: string;
}
