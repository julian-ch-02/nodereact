import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ITEM } from "../gql/query";
import { DELETE_ITEM, UPDATE_ITEM, DELETE_IMAGE } from "../gql/mutation";

import {
  Container,
  Table,
  Image,
  Button,
  Modal,
  Form,
  Col,
} from "react-bootstrap";
import Loading from "../component/Loading";
import Navbar from "../component/Navbar";
import { getToken } from "../authToken";
import axios from "axios";

const Dashboard = () => {
  const [values, setValues] = useState({});
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [images, setImages] = useState([]);
  const { data, loading } = useQuery(GET_ITEM);

  const [deleteItem] = useMutation(DELETE_ITEM, {
    update(_, data) {
      const { token } = getToken();
      axios
        .post(
          process.env.REACT_APP_DELETE_IMAGE,
          {
            image: data.data.deleteItem.images,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {})
        .catch((err) => console.log(err));
    },
    onError(err) {
      console.log(err);
    },
  });
  const [updateItem] = useMutation(UPDATE_ITEM, {
    update() {
      setModalEdit();
    },
  });
  const [deleteImage] = useMutation(DELETE_IMAGE, {
    update(_, data) {
      const { token } = getToken();
      axios
        .post(
          process.env.REACT_APP_DELETE_IMAGE,
          {
            image: data.data.deleteImage.name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setModal();
        })
        .catch((err) => console.log(err));
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();
    updateItem({
      variables: { id: values.id, content: values.content },
      refetchQueries: [{ query: GET_ITEM }],
    });
  };

  const handleDelete = (id) => {
    deleteItem({ variables: { id }, refetchQueries: [{ query: GET_ITEM }] });
  };

  const handleDeleteImage = (e) => {
    deleteImage({
      variables: { name: e.name, item_id: values.id },
      refetchQueries: [{ query: GET_ITEM }],
    });
  };

  if (loading) {
    return (
      <Container fluid>
        <Loading />
      </Container>
    );
  }
  return (
    <>
      <Navbar />
      <Container>
        <Table
          className="text-center mt-5"
          striped
          responsive
          bordered
          hover
          size="sm"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.getItems.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className="align-middle">{data.content}</td>
                  <td className="align-middle">
                    <Button
                      title="Images"
                      className="me-2"
                      onClick={() => {
                        setImages(data.images);
                        setValues(data);
                        setModal(true);
                      }}
                    >
                      <i className="fas fa-images"></i>
                    </Button>
                    <Button
                      title="Edit"
                      className="me-2"
                      variant="info"
                      onClick={() => {
                        setValues(data);
                        setModalEdit(true);
                      }}
                    >
                      <i className="fas fa-cog"></i>
                    </Button>
                    <Button
                      title="Delete"
                      variant="danger"
                      onClick={() => {
                        handleDelete(data.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
      {/* Show image Modal */}
      <Modal show={modal} onHide={setModal}>
        <Modal.Header closeButton>
          <Modal.Title>Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {images.length <= 0
            ? "No Images"
            : images.map((data) => {
                return (
                  <>
                    <Image
                      className="mb-1"
                      onMouseEnter={(e) => {
                        e.target.style.width = "100%";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.width = "65%";
                      }}
                      src={data.name}
                    />
                    <button
                      title="Delete Image"
                      className="btn btn-danger ms-5"
                      onClick={() => {
                        handleDeleteImage(data);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                );
              })}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Modal */}
      <Modal show={modalEdit} onHide={setModalEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Form.Label column sm="2">
              Item
            </Form.Label>
            <Col sm="10">
              <Form.Control
                type="text"
                name="content"
                disabled={loading && true}
                value={values.content}
                onChange={(e) => {
                  setValues({ ...values, [e.target.name]: e.target.value });
                }}
              />
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setModalEdit(false);
              }}
            >
              Close
            </Button>
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Dashboard;
