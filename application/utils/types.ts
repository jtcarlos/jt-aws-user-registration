export type IUser = {
  age: number;
  lastName: string;
  firstName: string;
  profilePicture: {
    data: string;
    fileName: string;
  };
};

export type IDefaultReturn = {
  statusCode: number;
  body: string;
};

export type ICreatePayload = {
  httpMethod: string;
  headers: Record<string, string>;
  body: string;
};
