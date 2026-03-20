import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './common/storage/storage.module';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';
import { PageModule } from './features/page/page.module';
import { LinkModule } from './features/link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    PrismaModule,
    StorageModule,
    AuthModule,
    UserModule,
    PageModule,
    LinkModule,
  ],
})
export class AppModule {}
