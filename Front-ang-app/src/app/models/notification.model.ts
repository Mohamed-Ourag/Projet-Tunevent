export class Notification {
  id: string;
  message: string;
  timestamp: Date;

  constructor(id: string, message: string, timestamp: Date) {
    this.id = id;
    this.message = message;
    this.timestamp = timestamp;
  }
}
