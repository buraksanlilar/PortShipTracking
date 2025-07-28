import countryList from "react-select-country-list";
export function fetchCountryWithFlags() {
    const countryOptions = countryList()
      .getData()
      .map((country) => ({
        label: `${getFlagEmoji(country.value)} ${country.label}`,
        value: country.label,
      }));
  
    function getFlagEmoji(countryCode: string): string {
      const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    }
    return countryOptions;
  }

