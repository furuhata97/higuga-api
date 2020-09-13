declare namespace Express {
  export interface Request {
    user: {
      id: string;
      is_admin: boolean;
    };
  }
}

declare namespace Express {
  export interface ParsedQs {
    sale_date: Date;
  }
}
