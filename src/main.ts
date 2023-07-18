import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userService = app.get(UserService);
  const adminUser = await userService.getUserByName('admin');

  if (!adminUser) {
    const newUser = new User();
    newUser.name = 'admin';
    newUser.password = 'admin';
    await userService.createUser(newUser);

    console.log('Admin user created.');
  }

  await app.listen(3000);
}
bootstrap();
