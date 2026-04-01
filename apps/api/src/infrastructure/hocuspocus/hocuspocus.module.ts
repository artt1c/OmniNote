import { Module } from '@nestjs/common';
import { PersistenceModule } from '../persistence/persistence.module';
import { HocuspocusGateway } from './hocuspocus.gateway';

@Module({
  imports: [PersistenceModule],
  providers: [HocuspocusGateway],
  exports: [HocuspocusGateway],
})
export class HocuspocusModule {}
