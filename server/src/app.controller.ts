import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.quard';
import { ReqUser } from './decorators/ReqUser';
import { UserDto } from './users/dto/user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return "Hello World!";
    }
    
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
}
