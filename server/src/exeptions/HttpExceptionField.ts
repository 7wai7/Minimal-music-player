import { HttpException, HttpStatus } from "@nestjs/common";

export default class HttpExceptionField extends HttpException {
    constructor(
        public errors: {
            field: string,
            message: string
        }[],
        message = "Validation error",
        status: HttpStatus = HttpStatus.BAD_REQUEST
    ) {
        super({ errors, message }, status);
    }
}