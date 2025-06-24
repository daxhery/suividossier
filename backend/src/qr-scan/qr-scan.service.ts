import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrScan } from './entities/qr-scan.entity';
import { CreateQrScanDto } from './dto/create-qr-scan.dto';

@Injectable()
export class QrScanService {
  constructor(
    @InjectRepository(QrScan)
    private qrScanRepository: Repository<QrScan>,
  ) {}

  async create(createQrScanDto: CreateQrScanDto, userId?: string): Promise<QrScan> {
    const qrScan = this.qrScanRepository.create({
      ...createQrScanDto,
      userId,
    });
    
    return this.qrScanRepository.save(qrScan);
  }

  async findAll(userId?: string): Promise<QrScan[]> {
    const queryBuilder = this.qrScanRepository.createQueryBuilder('qrScan');
    
    if (userId) {
      queryBuilder.where('qrScan.userId = :userId', { userId });
    }
    
    queryBuilder.orderBy('qrScan.createdAt', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<QrScan> {
    const qrScan = await this.qrScanRepository.findOne({ where: { id } });
    
    if (!qrScan) {
      throw new NotFoundException(`QR scan with id ${id} not found`);
    }
    
    return qrScan;
  }

  async remove(id: string): Promise<void> {
    const result = await this.qrScanRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`QR scan with id ${id} not found`);
    }
  }
} 