import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { StorageModule } from 'src/storage/storage.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SongsController],
  providers: [SongsService],
  imports: [
    StorageModule,
    AuthModule
  ],
  exports: [SongsService]
})
export class SongsModule {}
