export class DeleteMediaDto {
  publicId: string;

  constructor(publicId: DeleteMediaDto['publicId']) {
    this.publicId = publicId;
  }
}
