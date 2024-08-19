import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { join } from 'path';

@Controller('uvtt')
export class UVTTController {
  @Get(':location/:map')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  async getUVTTFile(
    @Param('location') location: string,
    @Param('map') map: string,
    @Res() res: Response,
  ): Promise<void> {
    const filename: string = join('data', 'maps', location, map + '.dd2vtt');
    const stream = fs.createReadStream(filename);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stream.on('error', (error) => {
      res.status(500).send('Internal Server Error');
    });

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${map}"`);

    // Pipe the file stream to the response
    stream.pipe(res);
  }
}
