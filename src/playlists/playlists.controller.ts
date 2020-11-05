import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JWTGuard } from 'src/auth/jwt-auth.guard';
import { Music } from 'src/music';
import {
  PlaylistDTO,
  UpdatePlaylistDTO,
  PlaylistMusicDTO,
} from './dtos/creat_playlist.dto';
import { Playlist, PlaylistMusic } from './interfaces';
import { PlaylistsService } from './playlists.service';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Get()
  async playlists(): Promise<Playlist[]> {
    return this.playlistsService.getPlaylists();
  }

  @Get(':playlist')
  async playlist(@Param('playlist') id: string): Promise<Playlist> {
    return this.playlistsService.getPlaylist(+id);
  }

  @Post()
  @UseGuards(JWTGuard)
  async create(
    @Body() playlistDTO: PlaylistDTO,
    @Request() req,
  ): Promise<Playlist> {
    return this.playlistsService.createPlaylist(req.user, playlistDTO);
  }

  @Put(':id')
  @UseGuards(JWTGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePlaylistDTO: UpdatePlaylistDTO,
    @Request() req,
  ): Promise<Playlist> {
    return this.playlistsService.updatePlaylist(
      req.user,
      +id,
      updatePlaylistDTO,
    );
  }

  @Delete(':id')
  @UseGuards(JWTGuard)
  async delete(@Param('id') id: string, @Request() req): Promise<Playlist> {
    return this.playlistsService.deletePlaylist(req.user, +id);
  }

  @Post(':id/music')
  @UseGuards(JWTGuard)
  async addToPlaylist(
    @Param('id') id: string,
    @Body() input: PlaylistMusicDTO,
    @Request() req,
  ): Promise<Music> {
    return this.playlistsService.addToPlaylist(req.user, +id, +input.musicID);
  }

  @Delete(':id/music/:musicID')
  @UseGuards(JWTGuard)
  async removeFromPlaylist(
    @Param('id') id: string,
    @Param('musicID') musicID: string,
    @Request() req,
  ): Promise<PlaylistMusic> {
    return this.playlistsService.removeFromPlaylist(req.user, +id, +musicID);
  }
}
