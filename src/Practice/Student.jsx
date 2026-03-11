const Student=({name,marks,grade})=>{
    const Grade=grade(marks);
    return(
        <div>
            <h1>name is {name}</h1>
            <h2>marks received: {marks}</h2>
            <h3>Grade: {Grade}</h3>
        </div>
    );
}
export default Student