import axios from "axios";

const baseUrl = "/api/persons";

const getAll = () => {
  return axios
    .get(baseUrl)
    .then((response) => response.data)
    .catch((error) => {
      console.log(`An error occured in getAll request. Error: ${error}`);
    });
};

const create = (contact) => {
  return axios
    .post(baseUrl, contact)
    .then((response) => response.data)
    .catch((error) => {
      console.log(`An error occured in create request. Error: ${error}`);
    });
};

const update = (id, contact) => {
  return axios
    .put(`${baseUrl}/${id}`, contact)
    .then((response) => response.data);
};

const deleteContact = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log(`An error occured in deleteContact request. Error: ${error}`);
    });
};

export default { getAll, create, update, deleteContact };
