import { Music } from 'src/music';
import { User } from 'src/user';

export interface Playlist {
  name: string;
  description?: string;
  author: number | User;
  musics?: PlaylistMusic[];
  readonly isDeleted: boolean;
  readonly thumbnail: string;
  readonly id: number;
}

export interface PlaylistMusic {
  playlist: number | Playlist;
  music: number | Music;
  id: number;
}
