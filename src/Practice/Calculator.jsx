const Calculator = ({n1,n2,add,sub,mul,div }) => {

    return (
        <div>
            <h1>CALCULATOR</h1>
            <h2>Numbers are: n1: {n1} and n2: {n2}</h2>
            <h3>Addition: {add(n1, n2)}</h3>
            <h3>Subtraction: {sub(n1, n2)}</h3>
            <h3>Multiplication: {mul(n1, n2)}</h3>
            <h3>Division: {div(n1, n2)}</h3>
        </div>
    )
}

export default Calculator;
