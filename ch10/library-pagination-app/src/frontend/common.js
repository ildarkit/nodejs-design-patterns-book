export function toNormalizedTitleCase(text) {
  return text
    .split(' ')
    .map(word => {
      return word.includes('.') ? word.toLocaleUpperCase() :
        String.fromCodePoint(word.codePointAt(0))
          .toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
    })
    .join(' ')
    .normalize('NFC');
}
