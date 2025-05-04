/**
 * Converts the first letter of the given string to uppercase
 * @param {string} str - The string to transform.
 *
 * @returns {string} The transformed string with the first letter in uppercase.
 */
export function firstLetterUppercase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Return the given string with the first letter in lower case.
 * @param {string} str - The string to transform.
 *
 * @returns {string} The transformed string.
 */
export function firstLetterLowerCase(str:string){
  return str.charAt(0).toLowerCase()+str.slice(1);
}