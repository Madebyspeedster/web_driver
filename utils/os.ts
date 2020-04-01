import clipboardy from 'clipboardy';

export async function readClipboard() {
  // TODO: generic
  return clipboardy.read;
}

export function parseArg(argName: string): string | undefined {
  const [arg] = process.argv.filter(arg => arg.includes(argName));

  if (typeof arg === 'string') {
    const [key, value] = arg.split('=');
    return key === argName ? value : undefined;
  }

  return undefined;
}
