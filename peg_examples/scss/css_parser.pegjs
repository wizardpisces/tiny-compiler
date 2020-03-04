{
	var key_val = {};
}

Program = _ var_expresstion:VarExpression* _ children:Expression* {
	return {var_expresstion,children}
}

VarExpression = '$'key_value:KeyValue 
{
    key_val['$'+key_value.key] = key_value.value
	return {
    	type:'var',
        property:'$'+key_value.key,
        value: key_value.value
    }
}


Expression = _ '.'selector:(Word) _ '{' key_values:KeyValue* _ children:Child* _ '}' 
{
    return {
        selector,
        key_values,
        children
    }
}

Child =  Expression

KeyValue = _ key:(Word) _ ':' _ value:(Word/VarKey) _ ';' _{
    if(value.type === 'var'){
        value = key_val[value.property]
    }
    return{key,value}
}

VarKey = '$'word:Word
{
	return {
    	type:'var',
        property:'$'+word
    }
}

Word = [-a-zA-Z0-9]+ { return text(); }

AlphaWord = [a-z]i+ { return text(); }

_ "whitespace" = [ \t\n\r]*





