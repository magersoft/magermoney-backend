import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import { readFileSync } from 'fs';

const isDev = process.env.NODE_ENV !== 'production';

const certificateConfig: HttpsOptions = {
  key: null,
  cert: null,
};

if (isDev) {
  certificateConfig.key = readFileSync(process.env.SSL_KEY_PATH || './secrets/localhost-key.pem');
  certificateConfig.cert = readFileSync(process.env.SSL_CERT_PATH || './secrets/localhost.pem');
}

export { certificateConfig };
