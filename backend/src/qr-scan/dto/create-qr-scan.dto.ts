import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQrScanDto {
  @ApiProperty({
    description: 'Contenu du QR code scanné',
    example: 'https://example.com/product/12345'
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Format du code scanné',
    example: 'QR_CODE',
    default: 'QR_CODE'
  })
  @IsString()
  @IsNotEmpty()
  format: string;

  @ApiProperty({
    description: 'Description optionnelle du scan',
    example: 'Produit scanné à l\'entrepôt',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
} 