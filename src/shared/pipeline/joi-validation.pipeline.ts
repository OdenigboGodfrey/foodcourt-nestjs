/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.Schema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      // 'Validation failed',
      throw new BadRequestException(error.details);
    }
    return value;
  }
}
