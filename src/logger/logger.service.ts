import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  log(message: string, context?: string) {
    super.log(`Custom log: ${message}`, context);
  }

  error(message: unknown, trace?: string, context?: string): void {
    super.error(`Custom error: ${message}`, trace, context);
  }
}
