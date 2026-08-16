// Decode a hex string XOR'd byte-by-byte with `xor` back to its UTF-8 string.
// Used by the flag command to derive the expected flag without storing it in
// plaintext.
export function xorDecodeHex(hex: string, xor: number): string {
  const bytes = hex.match(/../g) ?? [];
  return bytes.map((h) => String.fromCharCode(parseInt(h, 16) ^ xor)).join("");
}
