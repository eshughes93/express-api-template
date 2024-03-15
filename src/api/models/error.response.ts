import { HttpError } from '@/api/helpers/http-exceptions';
import { ReasonPhrases } from 'http-status-codes';

// JSONAPI Error response serializer
// Based on example here: https://jsonapi.org/examples/#error-objects
export class ErrorResponse {
  static serialize(
    error: Array<Error | HttpError | unknown> | Error | HttpError | unknown,
  ) {
    const errors: Array<Error | HttpError | unknown> = (
      [] as Array<Error | HttpError | unknown>
    ).concat(error);
    return {
      errors: errors.map((e) => {
        if (e instanceof HttpError) {
          return {
            status: e.statusCode,
            title: e.reason,
            detail: e.message,
          };
        } else {
          return {
            status: 500,
            title: ReasonPhrases.INTERNAL_SERVER_ERROR,
            detail: 'An unknown error occurred.',
          };
        }
      }),
    };
  }
}
