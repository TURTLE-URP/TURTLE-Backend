import { ApiProperty } from '@nestjs/swagger';

export class UploadedMedia {
  @ApiProperty({ example: 'turtle/abc123' })
  publicId: string;

  @ApiProperty({
    example: 'http://res.cloudinary.com/demo/image/upload/turtle/abc123.png',
  })
  url: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/demo/image/upload/turtle/abc123.png',
  })
  secureUrl: string;

  @ApiProperty({ example: 'png', nullable: true })
  format: string | null;

  @ApiProperty({ example: 245678, nullable: true })
  bytes: number | null;

  @ApiProperty({ example: 800, nullable: true })
  width: number | null;

  @ApiProperty({ example: 600, nullable: true })
  height: number | null;

  @ApiProperty({ example: 'image' })
  resourceType: string;

  @ApiProperty({ example: 'turtle', nullable: true })
  folder: string | null;

  constructor(
    publicId: UploadedMedia['publicId'],
    url: UploadedMedia['url'],
    secureUrl: UploadedMedia['secureUrl'],
    format: UploadedMedia['format'],
    bytes: UploadedMedia['bytes'],
    width: UploadedMedia['width'],
    height: UploadedMedia['height'],
    resourceType: UploadedMedia['resourceType'],
    folder: UploadedMedia['folder'],
  ) {
    this.publicId = publicId;
    this.url = url;
    this.secureUrl = secureUrl;
    this.format = format;
    this.bytes = bytes;
    this.width = width;
    this.height = height;
    this.resourceType = resourceType;
    this.folder = folder;
  }
}
