export function generateAuthCode() {
  const code = Math.floor(Math.random() * 1000000).toString();

  if (code.length !== 6) {
    return generateAuthCode();
  }

  return code;
}
