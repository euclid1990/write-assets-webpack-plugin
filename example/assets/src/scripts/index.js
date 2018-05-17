import { ReflectiveInjector } from 'injection-js';
import Message from './services/message.js';
import User from './services/user.js';
import App from './services/app.js';
import '../stylesheets/app.scss';

const injector = ReflectiveInjector.resolveAndCreate([User, Message, App]);

console.log(injector.get(App));

if (module.hot) {
  module.hot.accept('./services/app.js', () => {
    console.log('Accepting the updated App module!');
    ReflectiveInjector.resolveAndCreate([User, Message, App]).get(App);
  });
}
