export default function generateId() {
  return crypto.randomUUID().split("-")[0];
}
