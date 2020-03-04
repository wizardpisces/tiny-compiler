/* 
//input: 

mul 3 sub 2 sum 1 3 4

//output 

-18

 */


Expression = keyword: (Keyword) _ numbers: Integer + _ tail: Expression *
    {
        if(keyword === 'mul') return numbers.reduce((result, element) => {
            return result * element
        }, 1) * tail

if (keyword === 'sub') return numbers.reduce((result, element) => {
    return result - element
}) - tail

if (keyword === 'sum') return numbers.reduce((result, element) => {
    return result + element
}, 0) + tail

return {
    keyword,
    numbers,
    tail
}
}

Keyword = 'mul' / 'sub' / 'sum'

Integer "integer"
    = _[0 - 9] + { return parseInt(text(), 10); }

_ "whitespace"
    = [\t\n\r] *