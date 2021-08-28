export class TokenNameProvider {
    getName(token: any): string {
        if (typeof token === "string") {
            return token;
        }

        if (token instanceof Array) {
            return `[${token.map(this.getName).join(", ")}]`;
        }

        if (token == null) {
            return `${token}`;
        }

        if (token.overriddenName) {
            return `${token.overriddenName}`;
        }

        if (token.name) {
            return `${token.name}`;
        }

        const res = token.toString();

        if (res == null) {
            return `${res}`;
        }

        const newLineIndex = res.indexOf("\n");
        return newLineIndex === -1 ? res : res.substring(0, newLineIndex);
    }
}
