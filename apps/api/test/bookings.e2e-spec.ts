import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { GlobalExceptionFilter } from '../src/shared/filters/http-exception.filter';
import { PrismaExceptionFilter } from '../src/shared/filters/prisma-exception.filter';

describe('Bookings (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let token: string;
  let userId: string;
  let bookingId: string;

  const booking = {
    title: 'E2E Test Booking',
    startTime: '2099-01-15T09:00:00.000Z',
    endTime: '2099-01-15T10:00:00.000Z',
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(
      new PrismaExceptionFilter(),
      new GlobalExceptionFilter(),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    const jwtService = moduleFixture.get<JwtService>(JwtService);

    const user = await prisma.user.create({
      data: {
        auth0Id: 'e2e|test-user',
        email: 'e2e@test.com',
        name: 'E2E User',
      },
    });
    userId = user.id;
    token = jwtService.sign({ sub: userId });
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    await app.close();
  });

  it('401 without auth header', () => {
    return request(app.getHttpServer()).get('/api/bookings').expect(401);
  });

  it('POST /api/bookings → 201', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(booking)
      .expect(201);
    bookingId = (res.body as { id: string }).id;
    expect(bookingId).toBeDefined();
  });

  it('GET /api/bookings → includes created booking', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const ids = (res.body as { data: Array<{ id: string }> }).data.map(
      (b) => b.id,
    );
    expect(ids).toContain(bookingId);
  });

  it('POST /api/bookings overlapping → 409', () => {
    return request(app.getHttpServer())
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send(booking)
      .expect(409);
  });

  it('GET /api/bookings/availability free slot → available true', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/bookings/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({
        start: '2099-02-01T09:00:00.000Z',
        end: '2099-02-01T10:00:00.000Z',
      })
      .expect(200);
    expect((res.body as { available: boolean }).available).toBe(true);
  });

  it('GET /api/bookings/availability occupied slot → available false', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/bookings/availability')
      .set('Authorization', `Bearer ${token}`)
      .query({ start: booking.startTime, end: booking.endTime })
      .expect(200);
    expect((res.body as { available: boolean }).available).toBe(false);
  });

  it('PATCH /api/bookings/:id → 200 updated title', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title',
        startTime: booking.startTime,
        endTime: booking.endTime,
      })
      .expect(200);
    expect((res.body as { title: string }).title).toBe('Updated Title');
  });

  it('DELETE /api/bookings/:id → 204', () => {
    return request(app.getHttpServer())
      .delete(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('GET /api/bookings/:id after delete → 404', () => {
    return request(app.getHttpServer())
      .get(`/api/bookings/${bookingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
  });
});
