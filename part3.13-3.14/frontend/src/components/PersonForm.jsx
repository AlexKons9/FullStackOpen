const PersonForm = ({ contactHandler, telHandler, submitHandler }) => {
  return (
    <form>
      <div>
        name:{" "}
        <input
          id="contactName"
          onChange={contactHandler}
        />
      </div>
      <div>
        number:{" "}
        <input
          id="contactTel"
          onChange={telHandler}
        />
      </div>
      <button
        onClick={submitHandler}
        type="submit"
      >
        add
      </button>
    </form>
  );
};

export default PersonForm;
