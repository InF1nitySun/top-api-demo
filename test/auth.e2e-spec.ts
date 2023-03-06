import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  login: 'qwe@qwe.qw',
  password: 'asd',
};
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });
  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(401, {
        statusCode: 401,
        message: 'Пароль указан неверно',
        error: 'Unauthorized',
      });
  });
  it('/auth/login (POST) - fail login', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: '2' })
      .expect(401, {
        statusCode: 401,
        message: 'Пользователь с таким EMAIL не существует',
        error: 'Unauthorized',
      });
  });
  afterAll(() => {
    disconnect();
  });
});
