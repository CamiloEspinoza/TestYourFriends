import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';

// 1x1 transparent GIF (smallest valid)
const TRACKING_PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64',
);

@Controller('track')
export class TrackController {
  constructor(private prisma: PrismaService) {}

  @Get('open/:id')
  async trackOpen(@Param('id') id: string, @Res() res: Response) {
    const log = await this.prisma.emailLog.findUnique({
      where: { id },
    });
    if (!log) throw new NotFoundException();

    if (!log.openedAt) {
      await this.prisma.emailLog.update({
        where: { id },
        data: { openedAt: new Date() },
      });
    }

    res.set({
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Length': TRACKING_PIXEL.length,
    });
    res.send(TRACKING_PIXEL);
  }

  @Get('click/:id')
  async trackClick(
    @Param('id') id: string,
    @Query('url') url: string,
    @Res() res: Response,
  ) {
    const log = await this.prisma.emailLog.findUnique({
      where: { id },
    });
    if (!log) throw new NotFoundException();

    if (!log.clickedAt) {
      await this.prisma.emailLog.update({
        where: { id },
        data: { clickedAt: new Date() },
      });
    }

    const redirectUrl = url ? decodeURIComponent(url) : '/';
    res.redirect(302, redirectUrl);
  }
}
