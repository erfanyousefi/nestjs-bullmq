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
    return await this.transcodeQueue.add(
      {
        fileName: "./file.mp3",
      },
      {
        removeOnComplete: true,
        attempts: 3, //The total number of attempts to try the job until it completes.
        backoff: 2, // Backoff setting for automatic retries if the job fails.
      }
    );
  }
  uploadFile(file: Express.Multer.File) {
    this.transcodeQueue
      .add(
        "uploader",
        {
          file,
        },
        {
          removeOnComplete: true,
        }
      )
      .then(() => {
        console.log("Done");
      });
    return "in-progress";
  }
}

// priority: number - Optional priority value. Ranges from 1 (highest priority) to MAX_INT (lowest priority). Note that using priorities has a slight impact on performance, so use them with caution.
// delay: number - An amount of time (milliseconds) to wait until this job can be processed. Note that for accurate delays, both server and clients should have their clocks synchronized.
// attempts: number - The total number of attempts to try the job until it completes.
// repeat: RepeatOpts - Repeat job according to a cron specification. See RepeatOpts.
// backoff: number | BackoffOpts - Backoff setting for automatic retries if the job fails. See BackoffOpts.
// lifo: boolean - If true, adds the job to the right end of the queue instead of the left (default false).
// timeout: number - The number of milliseconds after which the job should fail with a timeout error.
// jobId: number | string - Override the job ID - by default, the job ID is a unique integer, but you can use this setting to override it. If you use this option, it is up to you to ensure the jobId is unique. If you attempt to add a job with an id that already exists, it will not be added.
// removeOnComplete: boolean | number - If true, removes the job when it successfully completes. A number specifies the amount of jobs to keep. Default behavior is to keep the job in the completed set.
// removeOnFail: boolean | number - If true, removes the job when it fails after all attempts. A number specifies the amount of jobs to keep. Default behavior is to keep the job in the failed set.
// stackTraceLimit: number - Limits the amount of stack trace lines that will be recorded in the stacktrace.
