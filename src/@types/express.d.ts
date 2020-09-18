declare namespace Express {
  export interface Request {
    user: {
      id: string;
      is_admin: boolean;
    };
  }
}
