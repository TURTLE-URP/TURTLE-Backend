export class UploadedMedia {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string | null;
  bytes: number | null;
  width: number | null;
  height: number | null;
  resourceType: string;
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
