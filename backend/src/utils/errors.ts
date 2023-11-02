const httpError = (message: string, status: number) => {
  console.log('error used');
  const err = new Error(message);
  (err as any).status = status;
  return err as Error & { status: number };
};

export default httpError;
