import { Inject } from 'injection-js';
import Message from './message.js';
import User from './user.js';

export default class App {
  static get parameters() {
    return [new Inject(User), new Inject(Message)];
  }

  constructor(user, message) {
    this.user = user;
    this.message = message;
  }
}
