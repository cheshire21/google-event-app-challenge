import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { PrismaService } from '@/shared/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async exchangeToken(
    auth0AccessToken: string,
  ): Promise<{ accessToken: string }> {
    const domain = this.config.getOrThrow<string>('AUTH0_DOMAIN');
    const audience = this.config.getOrThrow<string>('AUTH0_AUDIENCE');

    // Verify the Auth0 access token using JWKS
    const jwks = createRemoteJWKSet(
      new URL(`https://${domain}/.well-known/jwks.json`),
    );
    try {
      await jwtVerify(auth0AccessToken, jwks, {
        issuer: `https://${domain}/`,
        audience,
      });
    } catch {
      throw new UnauthorizedException('Invalid Auth0 access token');
    }

    // Fetch user info from Auth0
    const userInfoResponse = await fetch(`https://${domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${auth0AccessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      throw new UnauthorizedException('Failed to fetch user info from Auth0');
    }

    const userInfo = (await userInfoResponse.json()) as {
      email: string;
      name: string;
      sub: string;
    };

    const { email, name, sub } = userInfo;

    // Upsert the user in the database
    const user = await this.prisma.user.upsert({
      where: { auth0Id: sub },
      create: { auth0Id: sub, email, name },
      update: { email, name },
    });

    // Sign and return app JWT
    const accessToken = this.jwtService.sign({ sub: user.id });
    return { accessToken };
  }

  logout(userId: string): void {
    this.logger.log(`User ${userId} logged out`);
  }
}
