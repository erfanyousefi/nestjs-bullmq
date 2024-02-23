import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {AppService} from "./app.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";
import {Multer, diskStorage} from "multer";
import {extname} from "path";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post("/transcode")
  async transcode() {
    await this.appService.transcode();
  }
  @Post("/upload-file")
  @UseInterceptors(
    FileInterceptor("csv", {
      storage: diskStorage({
        destination: "./csv",
        filename: (req: Request, file: Express.Multer.File, callback) => {
          const filename = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${filename}.${ext}`);
        },
      }),
    })
  )
 uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadFile(file);
  }
}
