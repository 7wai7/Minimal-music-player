import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [StorageService],
  controllers: [StorageController],
  imports: [
    AuthModule,
  ],
  exports: [
    StorageService
  ]
})
export class StorageModule { }
