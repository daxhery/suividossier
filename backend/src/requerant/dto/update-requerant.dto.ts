import { PartialType } from '@nestjs/swagger';
import { CreateRequerantDto } from './create-requerant.dto';

export class UpdateRequerantDto extends PartialType(CreateRequerantDto) {} 