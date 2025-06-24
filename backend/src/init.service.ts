import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './auth/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminExists = await this.userRepository.findOne({
      where: { role: UserRole.ADMIN }
    });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminUser = this.userRepository.create({
        email: 'admin@domaine.com',
        password: hashedPassword,
        name: 'Administrateur',
        role: UserRole.ADMIN
      });
      await this.userRepository.save(adminUser);
      console.log('Utilisateur admin créé avec succès');
    }
  }
} 