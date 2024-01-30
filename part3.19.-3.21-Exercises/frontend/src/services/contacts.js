import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getAll = async () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = async (contact) => {
  return axios.post(baseUrl, contact).then((response) => response.data);
};

const update = async (id, contact) => {
  return axios
    .put(`${baseUrl}/${id}`, contact)
    .then((response) => response.data);
};

const deleteContact = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

export default { getAll, create, update, deleteContact };
