import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

if (mailConfig.driver === 'ethereal') {
  container.registerInstance<IMailProvider>('MailProvider', providers.ethereal);
}

if (mailConfig.driver === 'ses') {
  container.registerInstance<IMailProvider>('MailProvider', providers.ses);
}
