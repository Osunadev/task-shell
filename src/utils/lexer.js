const isKeyword = c => /[a-z]/i.test(c);
const isWhiteSpace = c => c === ' ';
const isLBracket = c => c === '[';
const isQuote = c => c === '"';
const isDigit = c => /\d/.test(c);
const isValidDate = str =>
  /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i.test(str);
const isValidNumber = str => /^\d+$/.test(str);

// This is an object of constants of token types, for us to not make some silly typos when
// pushing new tokens or when making comparisons
export const tokenTypes = {
  StmtKeyword: 'StmtKeyword', //  options: ['create', 'modify', 'remove']
  ElmtKeyword: 'ElmtKeyword', //  options: ["tasklist", "task"]
  AttrKeyword: 'AttrKeyword', //  options: ["description", "date", "time", "title", "from"]
  TitleText: 'TitleText',
  DescriptionText: 'DescriptionText',
  DateFormat: 'DateFormat',
  Number: 'Number'
};

class Lexer {
  constructor(input) {
    this.input = input;
    this.tokens = [];
    this.i = 0; // input index count
    this.c = ''; // current character from input

    this.lex();
  }

  next() {
    this.i++;
    return (this.c = this.input[this.i]);
  }

  addToken(type, value) {
    this.tokens.push({ type, value });
  }

  parseKeyword() {
    let keyword = this.c; // Setting the initial character of the keyword

    while (isKeyword(this.next()) && this.i < this.input.length)
      keyword += this.c;

    keyword = keyword.toLowerCase();

    switch (keyword) {
      case 'create':
      case 'modify':
      case 'remove':
        this.addToken(tokenTypes['StmtKeyword'], keyword);
        break;
      case 'tasklist':
      case 'task':
        this.addToken(tokenTypes['ElmtKeyword'], keyword);
        break;
      case 'description':
      case 'date':
      case 'title':
      case 'time':
      case 'from':
        this.addToken(tokenTypes['AttrKeyword'], keyword);
        break;
      default:
        throw Error(
          `Lexing Error: '${keyword}' not found in task-shell commands!`
        );
    }
  }

  parseTitleText() {
    let title = '';
    // At the beggining, we're skipping the current [ character
    while (this.next() !== ']') {
      if (this.i >= this.input.length)
        throw Error(
          `Lexing Error: ( '[${title}' ) missing its closing angle bracket: "`
        );
      title += this.c;
    }

    this.addToken(tokenTypes['TitleText'], title);
    // We're skipping the ] character because we don't need it
    this.next();
  }

  parseDescriptionText() {
    let description = '';

    // At the beggining, we're skipping the current " character
    while (this.next() !== '"') {
      if (this.i >= this.input.length)
        throw Error(
          `Lexing Error: ( '[${description}' ) missing its closing quote: "`
        );
      description += this.c;
    }

    this.addToken(tokenTypes['DescriptionText'], description);
    // We're skipping the " character because we don't need it
    this.next();
  }

  parseNumberOrDate() {
    // Adding the digit character of the string, so can start building our date or id format
    let dateOrNumber = this.c;

    // We're also checking for the index i to not be greater than the
    // input length, so that we don't get a result of undefined if we go
    // beyond the input string
    while (!isWhiteSpace(this.next()) && this.i < this.input.length)
      dateOrNumber += this.c;

    if (isValidDate(dateOrNumber))
      this.addToken(tokenTypes['DateFormat'], dateOrNumber);
    else if (isValidNumber(dateOrNumber))
      this.addToken(tokenTypes['Number'], dateOrNumber);
    else
      throw Error(
        `Lexing Error: '${dateOrNumber}' is not a valid number/date format!`
      );
  }

  lex() {
    while (this.i < this.input.length) {
      this.c = this.input[this.i];

      if (isWhiteSpace(this.c)) {
        this.next();
      } else if (isKeyword(this.c)) {
        this.parseKeyword();
      } else if (isLBracket(this.c)) {
        this.parseTitleText();
      } else if (isQuote(this.c)) {
        this.parseDescriptionText();
      } else if (isDigit(this.c)) {
        this.parseNumberOrDate();
      } else {
        throw Error(
          `Lexing Error: Unrecongnized token: '${this.c}', please read the Task-Shell Instructions.`
        );
      }
    }
  }
}

export default Lexer;
