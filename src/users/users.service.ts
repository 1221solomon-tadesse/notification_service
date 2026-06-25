import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Creates and persists a new user record.
   */
  async create(data: {
    name: string;
    email: string;
    password: string;
    fcmToken?: string;
  }): Promise<User> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException(
        `An account with email "${data.email}" already exists.`,
      );
    }

    const user = this.usersRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
      fcmToken: data.fcmToken ?? null,
    });

    return this.usersRepository.save(user);
  }

  /**
   * Finds a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  /**
   * Finds a user by their ID.
   */
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  /**
   * Updates the FCM device token for a given user (e.g. after login on a new device).
   */
  async updateFcmToken(userId: number, fcmToken: string): Promise<void> {
    await this.usersRepository.update(userId, { fcmToken });
  }
}
