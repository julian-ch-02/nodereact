import React from "react";
import axios from "axios";
import FileResizer from "react-image-file-resizer";
import Loading from "./Loading";
import { getToken } from "../authToken";

const UploadImage = ({ loading, values, setLoading, setValues, error, setError }) => {
  let images = [];
  const FileResize = (file) => {
    return new Promise((resolve) => {
      FileResizer.imageFileResizer(file, 300, 300, "JPEG", 100, 0, (file) => resolve(file), "blob");
    });
  };
  const handleUpload = async (e) => {
    let formData = new FormData();
    const { token } = getToken();
    for (let i = 0; i < e.target.files.length; i++) {
      if (!e.target.files[i].name.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG|gif)$/)) {
        setError({ image: "Please select valid image JPG,JPEG,PNG" });
        return false;
      }
      const image = await FileResize(e.target.files[i]);
      formData.append("images", image);
    }
    setLoading(true);
    axios
      .post(process.env.REACT_APP_UPLOAD_URI, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          images.push({ name: res.data[i] });
        }
        setValues({ ...values, images });
      })
      .catch((err) => {
        setError({ ...error, image: err });
      })
      .then(() => {
        setLoading(false);
      });
  };
  return (
    <form>
      <div className="input-group mb-3">
        <label className="input-group-text" for="inputGroupFile01">
          Upload
        </label>
        <input type="file" onChange={handleUpload} className="form-control" id="inputGroupFile01" multiple />
      </div>
      {loading && <Loading />}
    </form>
  );
};

export default UploadImage;
