import {Process, Processor} from "@nestjs/bull";
import {Logger} from "@nestjs/common";
import {TRANSCODE_NAME} from "./constant";
import {Job} from "bull";

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
    const result = await job.moveToCompleted("completed", true, true);
    this.logger.log(`result of process : `, JSON.stringify(result, null, 2));
  }
}