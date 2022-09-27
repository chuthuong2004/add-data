import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import productApi from "../../api/productApi";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    if (!authTokens?.accessToken) {
      navigate("/login");
    }
    const fetchProductList = async () => {
      try {
        const params = {
          page: 1,
          limit: 10,
        };
        const response = await productApi.getAllProduct(params);
        console.log(response);
      } catch (error) {
        console.log("Failed to fetch product list", error);
      }
    };
    const fecchCategoryList = async () => {
      try {
        const res = await axiosClient.get("/categories");
        console.log(res);
        res && setCategoryList(res.data);
      } catch (error) {
        console.log("Failed to fetch product list", error);
      }
    };
    const fetchBrandList = async () => {
      try {
        const res = await axiosClient.get("/brands");
        console.log(res);
        res && setBrandList(res.data);
      } catch (error) {
        console.log("Failed to fetch product list", error);
      }
    };
    fetchBrandList();
    fecchCategoryList();
  }, []);
  const handleLogout = () => {
    localStorage.setItem("authTokens", null);
    navigate("/login");
  };
  const handleCreateProduct = async () => {
    const newProduct = {
      name: undefined,
      description: undefined,
      price: 0,
      discount: 0,
      brand: undefined,
      category: undefined,
      preserveInformation: undefined,
      deliveryReturnPolicy: undefined,
      gender: undefined,
      keywords: [],
    };
    if (files) {
      const data = new FormData();
      const fileName = files.name; // abc.jpg
      for (const key of Object.keys(files)) {
        data.append("images", files[key]);
      }
      newProduct.img = fileName; // abc.jpg
      try {
        const res = await axiosClient.post("/upload/products", data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
    // await axiosClient.post("posts", newPost);
    // window.location.reload();
  };
  console.log(files);
  return (
    <div>
      <div className="form-add" action="">
        <div>
          <label htmlFor="">Tên sản phẩm:</label>
          <input type="text" placeholder="Nhập tên sản phẩm" />
        </div>
        <div>
          <label htmlFor="">Nhập mô tả:</label>
          <textarea
            name="desc"
            placeholder="Nhập mô tả sản phẩm"
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <label htmlFor="">Giá sản phẩm:</label>
          <input type="number" placeholder="Nhập giá sản phẩm" />
        </div>

        <div>
          <label htmlFor="">Giảm giá:</label>
          <input type="number" placeholder="Nhập phần trăm giảm giá" />
        </div>

        <div>
          <label htmlFor="">Hình ảnh sản phẩm (chọn nhiều ảnh):</label>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            multiple
          />
        </div>
        <div>
          <label htmlFor="">Hình ảnh nhỏ (chọn nhiều ảnh):</label>
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            multiple
          />
        </div>
        <div>
          <label htmlFor="">Chọn thương hiệu:</label>
          <select name="brand" id="">
            <option value="">Sản phẩm này thuộc thương hiệu nào ?</option>
            {brandList.length > 0 &&
              brandList.map((brand) => (
                <option value={brand._id} key={brand._id}>
                  {brand.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="">Chọn danh mục:</label>
          <select name="category" id="">
            <option value="">Danh mục sản phẩm thuộc loại nào ?</option>
            {categoryList.length > 0 &&
              categoryList.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="">Thông tin bảo quản:</label>
          <textarea
            name="desc"
            placeholder="Nhập thông tin bảo quản"
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <label htmlFor="">Chính sách giao hàng và đổi trả:</label>
          <textarea
            name="desc"
            placeholder="Nhập chính sách giao hàng và đổi trả"
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <label htmlFor="">Chọn giới tính:</label>
          <select name="gender" id="">
            <option value="">Sản phẩm dành cho ai ?</option>
            <option value="men">Nam</option>
            <option value="woman">Nữ</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>
        <div className="btn-add">
          <button onClick={handleCreateProduct}>Thêm product</button>
        </div>
      </div>
      <button onClick={handleLogout} className="logout">
        Đăng xuất
      </button>
    </div>
  );
};

export default Home;
