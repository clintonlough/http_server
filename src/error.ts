export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class LengthError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class PermissionError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}