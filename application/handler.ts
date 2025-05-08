export const handler = async (): Promise<{
  body: string;
  statusCode: number;
}> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Root Directory' }),
  };
};
