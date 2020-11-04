import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [AuthModule, UserModule, UtilModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
