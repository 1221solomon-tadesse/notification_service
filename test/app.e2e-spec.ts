import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/notifications/send (POST)', () => {
    it('should return 200 OK and success response when valid request is sent', () => {
      return request(app.getHttpServer())
        .post('/notifications/send')
        .send({
          recipient: 'fcm-token-xyz',
          type: 'USER_REGISTRATION',
          data: { name: 'Bob' },
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.messageId).toContain('dry-run');
        });
    });

    it('should return 400 Bad Request when recipient is missing', () => {
      return request(app.getHttpServer())
        .post('/notifications/send')
        .send({
          type: 'USER_REGISTRATION',
          data: { name: 'Bob' },
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toBe('recipient is required');
        });
    });

    it('should return 400 Bad Request when notification type is invalid', () => {
      return request(app.getHttpServer())
        .post('/notifications/send')
        .send({
          recipient: 'fcm-token-xyz',
          type: 'INVALID_TYPE',
          data: {},
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Invalid notification type');
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
