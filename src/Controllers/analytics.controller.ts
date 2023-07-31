import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Query,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '../Services/auth.guard';
import { AnalyticsService } from '../Services/analytics.service';
import { EventDataClass } from '../Schemas/event.schema';
import { AnalyticDataClass } from '../Schemas/analytics.schema';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../Constants/auth.constants';

interface CustomHeaders extends Headers {
  authorization?: string;
}

interface CustomRequest extends Request {
  headers: CustomHeaders;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly AnalyticsService: AnalyticsService,
    private jwtService: JwtService,
  ) {}

  @Get('/init')
  async init(@Request() req: any) {
    return this.AnalyticsService.create({}, '');
  }

  private async getUserFromToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      return payload;
    } catch {
      return { sub: '1' };
    }
  }

  private extractTokenFromHeader(request: CustomRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Request() req: any): Promise<AnalyticDataClass[]> {
    return this.AnalyticsService.findAll(req.user);
  }

  // @UseGuards(AuthGuard)
  // @Delete()
  // async delete(@Query("id") id: string) {
  //   return this.AnalyticsService.delete(id);
  // }
}
