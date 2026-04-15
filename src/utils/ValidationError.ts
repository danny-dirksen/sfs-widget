
export class ValidationError extends Error {
  constructor(message: string, public problems: string[]) {
    super(message);
    this.name = "ValidationError";
  }

  toString() {
    return `${this.name}: ${this.message}\n\n${this.problems.map(p => `- ${p}`).join("\n")}`;
  }
}
