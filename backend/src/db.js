import { execFile } from 'node:child_process';

function quoteLiteral(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function sql(strings, ...values) {
  return strings.reduce((acc, part, i) => acc + part + (i < values.length ? quoteLiteral(values[i]) : ''), '');
}

export function runQuery(command) {
  return new Promise((resolve, reject) => {
    execFile(
      'psql',
      ['--dbname', process.env.DATABASE_URL, '-t', '-A', '-F', '\t', '-c', command],
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }
        resolve(stdout.trim());
      },
    );
  });
}
