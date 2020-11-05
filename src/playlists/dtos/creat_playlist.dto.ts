import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlaylistDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class PlaylistDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class PlaylistMusicDTO {
  @IsNumber()
  @IsNotEmpty()
  musicID: string;
}
