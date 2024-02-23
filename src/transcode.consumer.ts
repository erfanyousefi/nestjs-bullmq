import {Process, Processor} from "@nestjs/bull";
import {Logger} from "@nestjs/common";
import {TRANSCODE_NAME} from "./constant";
import {Job} from "bull";
import * as csv from "csvtojson";
import {existsSync, unlinkSync, writeFile, writeFileSync} from "fs";
@Processor(TRANSCODE_NAME)
export class TranscodeConsumer {
  private readonly logger: Logger = new Logger(TranscodeConsumer.name);

  @Process()
  async transcode(job: Job<unknown>) {
    // this.logger.log(JSON.stringify(job, null, 2));
    this.logger.debug("Data: ", job.data);
    this.logger.log("Transcode Message: " + job.id);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000)); //some process like save or update data
    this.logger.log(`Transcode Process completed with id: ${job.id}`);
    await job.progress();
    const result = await job.moveToCompleted("completed", true, true);
    this.logger.log(`result of process : ${result}`);
  }
  @Process("uploader")
  async uploader(job: Job<unknown>) {
    // this.logger.log(JSON.stringify(job, null, 2));
    this.logger.debug("Data: ", job.data);
    const data: any = job.data;
    const processed = await csv().fromFile(data.file.path);
    writeFileSync(
      `./json/file-${job.id}.json`,
      JSON.stringify(processed, null, 2)
    );
    if (existsSync(data.file.path)) unlinkSync(data.file.path);
  }
}
