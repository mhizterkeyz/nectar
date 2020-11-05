import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { UserModule } from 'src/user/user.module';
import { MusicModule } from 'src/music/music.module';

@Module({
  providers: [PlaylistsService],
  exports: [PlaylistsService],
  imports: [UserModule, MusicModule],
  controllers: [PlaylistsController],
})
export class PlaylistsModule {}
