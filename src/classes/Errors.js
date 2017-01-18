class DigiBirdError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

class InterpretError extends DigiBirdError {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = {
  Error: DigiBirdError,
  InterpretError: InterpretError
}
