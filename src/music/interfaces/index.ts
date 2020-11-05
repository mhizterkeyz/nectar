export interface Music {
  title: string;
  artist: string;
  file: string;
  readonly id: number;
}

export interface MulterUploadFile {
  originalname: string;
  fieldname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}
