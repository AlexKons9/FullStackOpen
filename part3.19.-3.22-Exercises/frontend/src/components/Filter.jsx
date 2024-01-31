const Filter = ({ text, filterHandler }) => {
    return (
      <div>
        {text} : {" "}
        <input className="filter-input" type="text" placeholder="filter shown with" onChange={filterHandler} />
      </div>
    );
  }
  
  export default Filter;