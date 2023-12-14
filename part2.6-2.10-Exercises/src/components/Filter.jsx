const Filter = ({text, filterHandler}) => {
    return (
        <div>
            {text} 
            <input onChange={filterHandler} />
        </div>
    );
}

export default Filter;