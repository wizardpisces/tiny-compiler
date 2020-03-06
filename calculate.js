function inputStream(input) {
    var pos = 0, line = 1, col = 0;
    return {
        next: next,
        peek: peek,
        eof: eof,
        croak: croak,
    };
    function next() {
        var ch = input.charAt(pos++);
        if (ch == "\n") line++ , col = 0; else col++;
        return ch;
    }
    function peek() {
        return input.charAt(pos);
    }
    function eof() {
        return peek() == "";
    }
    function croak(msg) {
        throw new Error(msg + " (" + line + ":" + col + ")");
    }
}

// { type: "num", value: 5 }              // numbers
// { type: "op", value: "mul" }            // operators
function lex(input){
    let current = null;

    return {
        next,
        peek,
        eof
    }

    function is_op_char(ch) {
        return /[a-z]/i.test(ch);
    }

    function is_digit(ch) {
        return /[0-9]/i.test(ch);
    }

    function is_whitespace(ch) {
        return " \t\n".indexOf(ch) >= 0;
    }
    function read_while(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }
    function read_number() {
        var has_dot = false;
        var number = read_while(function (ch) {
            if (ch == ".") {
                if (has_dot) return false;
                has_dot = true;
                return true;
            }
            return is_digit(ch);
        });
        return { type: "num", value: parseFloat(number) };
    }

    function read_op(){
        return {
            type: "op",
            value: read_while(is_op_char)
        }
    }

    function read_next() {
        read_while(is_whitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        if (is_digit(ch)) return read_number();
        if (is_op_char(ch)) return read_op();

        input.croak("Can't handle character: " + ch);
    }

    function peek() {
        return current || (current = read_next());
    }
    function next() {
        var tok = current;
        current = null;
        return tok || read_next();
    }
    function eof() {
        return peek() == null;
    }
    
}

/* 
  num := 0-9+
  op := sum | sub | div | mul
  expr := num | op expr+
*/
  
function parse(input){

    function is_num() {
        var tok = input.peek();
        return tok && tok.type == "num";
    }

    function peek() {
        return input.peek();
    }

    function parseNumber(){
        return {
            type:'num',
            value: input.next().value
        }
    }

    function parseOp(){
        let node = {
            type: 'op',
            value : input.next().value,
            exprs : []
        }

        while(peek()) node.exprs.push(parseExpr());

        return node;
    }

    function parseExpr(){
        return is_num() ? parseNumber() : parseOp()
    }

    return parseExpr()
}


function compile(ast){
    const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
    function compileNum(){
        return ast.value
    }

    function compileOp(ast){
        return '(' + ast.exprs.map(compile).join(' ' + opMap[ast.value] + ' ' ) + ')';
    }

    function dispatch(ast){
        switch (ast.type){
            case 'num': return compileNum(ast);
            case 'op': return compileOp(ast)
        }
    }

    return dispatch(ast)
}

function evaluate(ast){
    function evaluateNum(ast){
        return ast.value
    }

    function evaluateOp(ast){
        let list = ast.exprs.map(evaluate);
        if (ast.value === 'mul') return list.reduce((result, expr) => result * (expr),1)
        if (ast.value === 'sum') return list.reduce((result, expr) => result + (expr),0)
        if (ast.value === 'sub') return list.reduce((result, expr) => result - (expr))
        if (ast.value === 'div') return list.reduce((result, expr) => result / (expr))
    }
    
    function dispatch(ast) {
        switch (ast.type) {
            case 'num': return evaluateNum(ast);
            case 'op': return evaluateOp(ast)
        }
    }

    return dispatch(ast)
}


const program = 'mul 3 sub 2 sum 1 3 4';



console.log(JSON.stringify(parse(lex(inputStream(program)))))
/*
  # Interpreter

  In order to interpret the input stream we feed the parser with the input
  from the lexer and the evaluator with the output of the parser.
*/
console.log(evaluate(parse(lex(inputStream(program)))));

/*
  # Compiler

  In order to compile the expression to JavaScript, the only change we need to make
  is to update the outermost `evaluate` invocation to `compile`.
*/
console.log(compile(parse(lex(inputStream(program))))); //(3 * (2 - (1 + 3 + 4)))