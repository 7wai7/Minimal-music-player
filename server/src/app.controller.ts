import { Controller, Get, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.quard';
import { ReqUser } from './decorators/ReqUser';
import { UserDto } from './users/dto/user.dto';
import type { Request } from 'express';
import type { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StorageService } from './storage/storage.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly storageService: StorageService
    ) { }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Search music by term' })
    @ApiParam({ name: 'searchTerm', type: String, description: 'Term to search for' })
    @ApiResponse({ status: 200, description: 'Search results returned successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @Get('/search')
    @UseGuards(JwtAuthGuard)
    search(@Param('searchTerm') searchTerm: string, @ReqUser() user: UserDto) {
        return this.appService.search(user.id, searchTerm);
    }



    @Get('/audio')
    async streamAudio(@Query('url') url: string, @Req() req: Request, @Res() res: Response) {
        const fileName = url.split('/').pop();
        console.log("fileName", fileName);
        
        if (!fileName) return res.status(400).send('File required');

        const bucket = this.storageService.storage.bucket(String(process.env.GCS_BUCKET_NAME));
        const file = bucket.file(fileName);
        const [metadata] = await file.getMetadata();
        const fileSize = Number(metadata.size);

        const range = req.headers.range;
        if (range) {
            // Parse range: "bytes=start-end"
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            res.status(206);
            res.set({
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'audio/mpeg',
            });

            file.createReadStream({ start, end }).pipe(res).on('error', (err) => {
                console.error(err);
                res.sendStatus(500);
            });
        } else {
            // Весь файл
            res.set({
                'Content-Length': fileSize,
                'Content-Type': 'audio/mpeg',
                'Accept-Ranges': 'bytes',
            });
            file.createReadStream().pipe(res).on('error', (err) => {
                console.error(err);
                res.sendStatus(500);
            });
        }
    }
}
