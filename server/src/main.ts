import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { HttpException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
dotenv.config();

function formatErrors(errors: ValidationError[]): { field: string; messages: string[] }[] {
	const result: { field: string, messages: string[] }[] = [];

	for (const err of errors) {
		if (err.constraints) {
			result.push({
				field: err.property,
				messages: Object.values(err.constraints)
			});
		}
		if (err.children?.length) {
			const child = formatErrors(err.children);
			result.push(...child);
		}
	}

	return result;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	app.setGlobalPrefix('/api');
	app.enableCors({
		origin: 'http://localhost:5173',
		credentials: true,
	});
	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,            // видалити зайві поля
		forbidNonWhitelisted: false, // кидати помилку при зайвих полях
		transform: true,            // автоматично трансформувати до типів DTO
		exceptionFactory: (errors: ValidationError[]) => {
			console.log("errors", errors);

			const formatted = formatErrors(errors).map(item => ({
				field: item.field,
				message: item.messages.join(', ')
			}));
			throw new HttpException({ errors: formatted, message: "Validation error" }, HttpStatus.BAD_REQUEST);
		}
	}));

	const config = new DocumentBuilder()
		.setTitle('Minimal music player')
		.setDescription('Документація REST API')
		.setVersion('1.0.0')
		.addCookieAuth('token', {
			type: 'http',
			in: 'cookie'
		})
		.build()

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('/api/docs', app, document);
  
	const port = process.env.PORT || 3000;
	await app.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
}
bootstrap();
