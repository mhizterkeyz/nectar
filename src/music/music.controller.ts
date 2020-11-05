import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { stat, createReadStream } from 'fs';
import { lookup } from 'mime-types';
import { UploadMusicDTO } from './dtos/music.dto';
import { Music } from './interfaces';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':id')
  async play(@Res() res: Response, @Param('id') id: string): Promise<any> {
    const music = await this.musicService.getSingleMusic({ id: +id });
    const { file } = music;
    const writableStream = createReadStream(file);
    writableStream.on('open', () => {
      stat(file, (err, stat) => {
        if (err) {
          console.log('an error occurred while playing music', {
            message: err.message,
            stack: err.stack,
            ...err,
          });
          return res
            .status(500)
            .json({ message: 'internal server error', status: 500 });
        }
        res.writeHead(200, {
          'Content-Type': lookup(file),
          'Content-Length': stat.size,
        });

        writableStream.pipe(res);
      });
    });

    writableStream.on('error', err => {
      console.log('an error occurred while playing music', {
        message: err.message,
        stack: err.stack,
        ...err,
      });
      res.status(500).json({ message: 'internal server error', status: 500 });
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('music'))
  async upload(
    @UploadedFile() music,
    @Body() musicDTO: UploadMusicDTO,
  ): Promise<Music> {
    return this.musicService.upload(musicDTO, music);
  }

  @Get()
  async getMusic(): Promise<Music[]> {
    return this.musicService.getMusic();
  }
}
