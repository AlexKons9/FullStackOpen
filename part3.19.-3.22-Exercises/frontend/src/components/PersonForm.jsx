const PersonForm = ({ contactHandler, telHandler, submitHandler }) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          id="contactName"
          className="form-input"
          onChange={contactHandler}
        />
      </div>
      <div>
        number:{" "}
        <input
          id="contactTel"
          className="form-input"
          onChange={telHandler}
        />
      </div>
      <button
        className="add-btn"
        onClick={submitHandler}
        type="submit"
      >
        add
      </button>
    </form>
  );
};

export default PersonForm;
