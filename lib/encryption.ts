import crypto from "crypto";

const SECRET_KEY = process.env.AES_SECRET_KEY as string;

if (!SECRET_KEY) throw new Error("AES_SECRET_KEY tidak diset");

const key = crypto.createHash("sha256").update(SECRET_KEY).digest(); // pastikan 32 byte

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

  return `${iv.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivBase64, encryptedBase64] = encryptedText.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  return decrypted.toString("utf8");
}
