import type { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

function makeException(code: string): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError('msg', {
    code,
    clientVersion: '5.0',
  });
}

function makeHost(jsonSpy: jest.Mock, statusSpy: jest.Mock): ArgumentsHost {
  const response = { status: statusSpy.mockReturnThis(), json: jsonSpy };
  return {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;
}

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let jsonSpy: jest.Mock;
  let statusSpy: jest.Mock;

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    jsonSpy = jest.fn();
    statusSpy = jest.fn().mockReturnThis();
  });

  it('maps P2025 to 404', () => {
    filter.catch(makeException('P2025'), makeHost(jsonSpy, statusSpy));
    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: 'Resource not found',
      }),
    );
  });

  it('maps P2002 to 409', () => {
    filter.catch(makeException('P2002'), makeHost(jsonSpy, statusSpy));
    expect(statusSpy).toHaveBeenCalledWith(409);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        message: 'Resource already exists',
      }),
    );
  });

  it('maps unknown codes to 500 with generic message', () => {
    filter.catch(makeException('P2003'), makeHost(jsonSpy, statusSpy));
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        message: 'Internal server error',
      }),
    );
  });
});
