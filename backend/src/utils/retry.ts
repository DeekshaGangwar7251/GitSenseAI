export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      console.log(
        `Retry ${attempt}/${retries} failed...`
      );

      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }
  }

  throw lastError;
}