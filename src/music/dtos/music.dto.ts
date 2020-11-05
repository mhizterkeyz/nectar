import { IsNotEmpty, IsString } from 'class-validator';

export class UploadMusicDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;
}
