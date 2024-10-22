import {NextFunction, Request, Response} from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import checkUserRole from '../utils/checkRole';

describe('checkUserRole', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 403 if no user is attached to the request', () => {
    const checkRole = checkUserRole(['admin']);
    checkRole(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Unauthorized'});
  });

  it('should return 403 if the user role is not in the allowed roles', () => {
    mockRequest.user = {
      role: 'user',
      email: 'test@example.com',
      userrole: 1,
      userid: 1,
    };
    const checkRole = checkUserRole(['admin']);
    checkRole(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({error: 'Unauthorized'});
  });

  it('should call next if the user role is in the allowed roles', () => {
    mockRequest.user = {
      role: 'admin',
      email: 'admin@example.com',
      userrole: 4,
      userid: 2,
    };
    const checkRole = checkUserRole(['admin']);
    checkRole(mockRequest as Request, mockResponse as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
