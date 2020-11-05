import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MulterUploadFile, Music } from './interfaces';
import { find } from 'lodash';
import { writeFile } from 'fs';
import { join } from 'path';
import { UploadMusicDTO } from './dtos/music.dto';

@Injectable()
export class MusicService {
  musics: Music[];

  constructor() {
    this.musics = [
      {
        title: "Don't you remember",
        artist: 'Adele',
        file: join(__dirname, '../../lib/muzik.mp3'),
        id: 0,
      },
    ];
  }

  async upload(
    musicDTO: UploadMusicDTO,
    music: MulterUploadFile,
  ): Promise<Music> {
    const { title, artist } = musicDTO;
    if (!music || music.mimetype !== 'audio/mpeg')
      throw new BadRequestException([
        'music must not be empty',
        'music must be an audio file',
      ]);

    if (find(this.musics, { title }) || find(this.musics, { artist }))
      return find(this.musics, { title }) || find(this.musics, { artist });
    const buffer = Buffer.from(music.buffer);
    const extArr = music.originalname.split('.');
    const file = join(
      __dirname,
      `../../lib/${title.replace(/[^\w\d]/gi, '-')}-${artist.replace(
        /[^\w\d]/gi,
        '-',
      )}.${extArr[extArr.length - 1]}`,
    );
    const res: Music = await new Promise((resolve, reject) => {
      return writeFile(file, buffer, err => {
        if (err) {
          console.log('an error occurred while uploading music', {
            message: err.message,
            stack: err.stack,
            ...err,
          });
          return reject(new InternalServerErrorException());
        }

        resolve({
          title,
          id: this.musics.length,
          artist,
          file,
        });
      });
    });
    this.musics.push(res);

    return res;
  }

  async getSingleMusic(param: Record<string, any>): Promise<Music> {
    const music = find(this.musics, param);
    if (!music) throw new NotFoundException('Music not found');
    return music;
  }

  async getMusic(): Promise<Music[]> {
    return this.musics;
  }
}
