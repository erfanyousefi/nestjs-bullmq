import {InjectQueue} from "@nestjs/bull";
import {Injectable} from "@nestjs/common";
import {TRANSCODE_NAME} from "./constant";
import {Queue} from "bull";

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(TRANSCODE_NAME) private readonly transcodeQueue: Queue
  ) {}
  getHello(): string {
    return "Hello World!";
  }
  async transcode() {
    return await this.transcodeQueue.add({
      fileName: "./file.mp3",
    });
  }
}
