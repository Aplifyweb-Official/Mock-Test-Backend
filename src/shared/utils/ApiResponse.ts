/**
 * Custom Response Class for standardizing API Success Responses.
 * Use this to send data from your controllers to the frontend.
 */
export class ApiResponse<T> {
  public statusCode: number;
  public data: T;
  public message: string;
  public success: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    
    // Status code agar 400 se kam hai (like 200, 201), toh success hamesha true hoga
    this.success = statusCode < 400; 
  }
}