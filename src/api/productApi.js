import axiosClient from "./axiosClient";

const productApi = {
  createProduct: (data) => {
    const url = "/admin/product/new";
    return axiosClient.post(url, { data });
  },
  getAllProduct: (params) => {
    const url = "/products";
    return axiosClient.get(url, { params });
  },
  uploadImage: (params) => {
    const url = "/";
    return axiosClient.post(url, { params });
  },
};
export default productApi;
