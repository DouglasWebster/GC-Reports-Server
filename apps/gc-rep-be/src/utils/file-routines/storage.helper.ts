import fs from 'fs';

export const checkIfFileOrDirectoryExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export const getCSVFile = async (
  path: string
): Promise<string[]> => {
  console.log(`path: ${path}`);

  const compData: string[] = [];

  const allFileContents = await fs.promises.open(path, 'r');
  for await (const line of allFileContents.readLines()) {
    let lineData = '';
    for (const symbol of line) {
      if (symbol != '"') lineData += symbol;
    }
    compData.push(lineData);
  }
  return compData;
};
