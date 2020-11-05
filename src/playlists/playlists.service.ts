import { Injectable, NotFoundException } from '@nestjs/common';
import { merge, findIndex } from 'lodash';
import { Music, MusicService } from 'src/music';
import { User, UserService } from 'src/user';
import { PlaylistDTO, UpdatePlaylistDTO } from './dtos/creat_playlist.dto';
import { Playlist, PlaylistMusic } from './interfaces';

@Injectable()
export class PlaylistsService {
  private playLists: Playlist[];
  private musics: Record<number, PlaylistMusic[]>;

  constructor(
    private readonly userService: UserService,
    private readonly musicService: MusicService,
  ) {
    this.playLists = [
      {
        name: 'Feel good songs',
        id: 0,
        author: 0,
        thumbnail: 'https://picsum.photos/500',
        description: 'Songs you listen to when you need to feel good',
        isDeleted: false,
      },
    ];
    this.musics = {
      0: [
        {
          id: 0,
          playlist: 0,
          music: 0,
        },
      ],
    };
  }

  async getPlaylists(): Promise<Playlist[]> {
    const populatedPlaylists = this.playLists.map(async playlist => {
      const author = await this.userService.findSingleUser({
        id: playlist.author,
      });
      delete author.password;
      return { ...playlist, author };
    });

    return Promise.all(populatedPlaylists);
  }

  async getPlaylist(id: number): Promise<Playlist> {
    const playlist = this.playLists[id];
    if (!playlist || playlist.isDeleted)
      throw new NotFoundException('Playlist not found');
    const author = await this.userService.findSingleUser({
      id: playlist.author,
    });
    delete author.password;
    const musicsPop = this.musics[id].map(async item => {
      return {
        ...item,
        music: await this.musicService.getSingleMusic({ id: item.music }),
      };
    });

    const musics = await Promise.all(musicsPop);
    return { ...playlist, author, musics };
  }

  async createPlaylist(
    user: User,
    playlistDTO: PlaylistDTO,
  ): Promise<Playlist> {
    const playlistObj = {
      ...playlistDTO,
      author: user.id,
      id: this.playLists.length,
      thumbnail: 'https://picsum.photos/500',
      isDeleted: false,
    };
    this.playLists.push(playlistObj);
    delete user.password;
    return { ...playlistObj, author: user };
  }

  async updatePlaylist(
    user: User,
    id: number,
    updatePlaylistDTO: UpdatePlaylistDTO,
  ): Promise<Playlist> {
    const playlist = this.playLists[id];
    if (!playlist || playlist.isDeleted || playlist.author !== user.id)
      throw new NotFoundException('Playlist not found');
    merge(playlist, updatePlaylistDTO);
    delete user.password;
    return { ...playlist, author: user };
  }

  async deletePlaylist(user: User, id: number): Promise<Playlist> {
    const playlist = this.playLists[id];
    if (!playlist || playlist.isDeleted || playlist.author !== user.id)
      throw new NotFoundException('Playlist not found');
    merge(playlist, { isDeleted: true });
    delete user.password;

    return { ...playlist, author: user };
  }

  async addToPlaylist(user: User, id: number, musicID: number): Promise<Music> {
    const playlist = this.playLists[id];
    if (!playlist || playlist.isDeleted || playlist.author !== user.id)
      throw new NotFoundException('Playlist not found');
    const music = await this.musicService.getSingleMusic({ id: musicID });
    if (!music) throw new NotFoundException('Music not found');
    const playlistMusicObj = {
      id: this.musics[id].length,
      playlist: id,
      music: music.id,
    };
    this.musics[id].push(playlistMusicObj);

    return music;
  }

  async removeFromPlaylist(
    user: User,
    id: number,
    musicID: number,
  ): Promise<PlaylistMusic> {
    const playlist = this.playLists[id];
    if (!playlist || playlist.isDeleted || playlist.author !== user.id)
      throw new NotFoundException('Playlist not found');
    const music = findIndex(this.musics[id], { music: musicID });
    if (!music) throw new NotFoundException('Music not found');

    const muse = { ...this.musics[id][music] };
    delete this.musics[id][music];

    return muse;
  }
}
