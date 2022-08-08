
// you must not have declare not used variables
// you must always give space before and after parenthesis and brackets
// you must always use semicolons after each declarations
// the else statement must be in the same line which its brackets

const a = 2;
const b = 3;

function sum (x: number, y:number) {
  return x + y;
};

sum(a, b);

function isUppercase (word: string): string {
  const upperWord = word.toUpperCase();

  if (word === upperWord) {
    return 'The word is on uppercase!';
  } else {
    return 'The word is not on uppercase... =(';
  };
}

isUppercase('hello');

export { sum, isUppercase };

console.log('That is working!');
