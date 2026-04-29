export async function withError<T>(
  action: () => Promise<T>, 
  setError: (msg: string) => void,
): Promise<T | null> { 
  try {
    const result = await action();
    return result; 
  } catch (err) {
    setError(err instanceof Error ? err.message : "Error desconocido");
    return null; 
  }
}