/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonEvent } from './event'

enum LoggerEvent {
  error = 'error',
  warn = 'warn',
  log = 'log',
  debug = 'debug',
  verbose = 'verbose',
}

class Logger {
  public error(message: string) {
    console.error(message)
  }

  public warn(message: string) {
    console.warn(message)
  }

  public log(message: string) {
    console.log(message)
  }

  public debug(message: string) {
    console.debug(message)
  }

  public verbose(message: string) {
    // console.verbose(message)
  }
}

export class CommonLogger {
  constructor() {
    if (!CommonLogger._instance) {
      CommonLogger._instance = this
    }
    return CommonLogger._instance
  }

  private _logger: Logger = new Logger()

  private _event: CommonEvent = new CommonEvent()

  private static _instance: CommonLogger

  public static get instance(): CommonLogger {
    if (!CommonLogger._instance) {
      CommonLogger._instance = new CommonLogger()
    }
    return CommonLogger._instance
  }

  public error(message: any): void {
    try {
      this._logger.error(message)
      this._event?.emit(LoggerEvent.error, message)
    } catch (error) {
      ///
    }
  }

  public onError(listener: (message: string, context?: string) => void) {
    this._event?.addListener(LoggerEvent.error, listener)
  }

  public warn(message: any): void {
    try {
      this._logger.warn(message)
      this._event?.emit(LoggerEvent.warn, message)
    } catch (error) {
      ///
    }
  }

  public onWarn(listener: (message: string, context?: string) => void) {
    this._event?.addListener(LoggerEvent.warn, listener)
  }

  public log(message: any): void {
    try {
      this._logger.log(message)
      this._event?.emit(LoggerEvent.log, message)
    } catch (error) {
      ///
    }
  }

  public onLog(listener: (message: string, context?: string) => void) {
    this._event?.addListener(LoggerEvent.log, listener)
  }

  public debug(message: any): void {
    try {
      this._logger.debug(message)
      this._event?.emit(LoggerEvent.debug, message)
    } catch (error) {
      ///
    }
  }

  public onDebug(listener: (message: string, context?: string) => void) {
    this._event?.addListener(LoggerEvent.debug, listener)
  }

  public verbose(message: any): void {
    try {
      this._logger.verbose(message)
      this._event?.emit(LoggerEvent.verbose, message)
    } catch (error) {
      ///
    }
  }

  public onVerbose(listener: (message: string, context?: string) => void) {
    this._event?.addListener(LoggerEvent.verbose, listener)
  }
}
