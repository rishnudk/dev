export class ApiResponse {
  success: boolean
  message: string
  data: unknown

  constructor(success: boolean, message: string, data: unknown = null) {
    this.success = success
    this.message = message
    this.data = data
  }

  static success(data: unknown, message = 'Success') {
    return new ApiResponse(true, message, data)
  }

  static error(message = 'Something went wrong') {
    return new ApiResponse(false, message, null)
  }
}