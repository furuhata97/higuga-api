interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      email: 'no-reply@higuga.com.br',
      name: 'Higuga Depósito de Bebidas',
    },
  },
} as IMailConfig;
