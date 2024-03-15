import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  statusCode!: StatusCodes;
  reason!: ReasonPhrases;
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }
}

export class InternalServerError extends HttpError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  reason = ReasonPhrases.INTERNAL_SERVER_ERROR;

  constructor(message = 'An unknown error occurred.') {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  statusCode = StatusCodes.BAD_REQUEST;
  reason = ReasonPhrases.BAD_REQUEST;
}
export class UnauthenticatedError extends HttpError {
  statusCode = StatusCodes.UNAUTHORIZED;
  reason = ReasonPhrases.UNAUTHORIZED;
}

export class ForbiddenError extends HttpError {
  statusCode = StatusCodes.FORBIDDEN;
  reason = ReasonPhrases.FORBIDDEN;
}

export class UnsupportedMediaTypeError extends HttpError {
  statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  reason = ReasonPhrases.UNSUPPORTED_MEDIA_TYPE;
}

export class NotFoundError extends HttpError {
  statusCode = StatusCodes.NOT_FOUND;
  reason = ReasonPhrases.NOT_FOUND;
}
