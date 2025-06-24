import { PartialType } from '@nestjs/swagger';
import { CreatePiecesDto } from './create-pieces.dto';

export class UpdatePiecesDto extends PartialType(CreatePiecesDto) {} 