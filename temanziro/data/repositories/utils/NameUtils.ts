export const nameParsing = (name: string): string => {
    const word = name.trim().split(/\s+/);
    if (word.length <= 1) {
        return word[0] || "";
    }
    const firstName = word[0];
    const lastName = word[word.length - 1];
    return `${firstName} ${lastName}`;
};