import {readFileSync} from 'fs';

export default (inputFilePath: string) => {
  return readFileSync(inputFilePath, 'utf-8');
};