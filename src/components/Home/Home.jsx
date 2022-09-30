import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import productApi from "./../../api/productApi";

const Home = () => {
  const [categoryList, setCategoryList] = useState([]); // lưu danh sách các danh mục
  const [brandList, setBrandList] = useState([]); // lưu danh sách các thương hiệu
  const [inputColor, setInputColor] = useState({
    images: [],
    imageMedium: null,
    imageSmall: null,
    colorName: "",
  });
  const [colorsProduct, setColorsProduct] = useState([]);
  const [listSize, setListSize] = useState([]);
  const [size, setSize] = useState({
    size: "",
    quantity: "",
  });
  const [inputProduct, setInputProduct] = useState({
    name: "",
    price: "",
    discount: "",
    description: "",
    colors: [],
    brand: "",
    preserveInformation: "",
    deliveryReturnPolicy: "",
    category: "",
    keywords: [],
    gender: "",
  });
  const [keyword, setKeyword] = useState("");
  const [listKeyWords, setListKeyWords] = useState([]);
  const sizeRef = useRef();
  const inputKeywordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let authTokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;
    if (!authTokens?.accessToken) {
      navigate("/login");
    }
    const fecchCategoryList = async () => {
      try {
        const res = await axiosClient.get("/categories");
        res && setCategoryList(res.data);
      } catch (error) {
        console.log("Failed to fetch product list", error);
      }
    };
    const fetchBrandList = async () => {
      try {
        const res = await axiosClient.get("/brands");
        res && setBrandList(res.data);
      } catch (error) {
        console.log("Failed to fetch product list", error);
      }
    };
    fetchBrandList();
    fecchCategoryList();
  }, []);
  useEffect(() => {
    colorsProduct.length > 0 &&
      setInputProduct((prev) => ({ ...prev, colors: colorsProduct }));
    listKeyWords.length > 0 &&
      setInputProduct((prev) => ({ ...prev, keywords: listKeyWords }));
  }, [colorsProduct, listKeyWords]);
  const handleLogout = () => {
    localStorage.setItem("authTokens", null);
    navigate("/login");
  };
  const handleCreateProduct = async () => {
    if (
      inputProduct.name &&
      inputProduct.description &&
      inputProduct.price &&
      inputProduct.discount &&
      inputProduct.brand &&
      inputProduct.category &&
      inputProduct.deliveryReturnPolicy &&
      inputProduct.colors.length > 0 &&
      inputProduct.gender &&
      inputProduct.keywords.length > 0 &&
      inputProduct.preserveInformation
    ) {
      const generateNewColors = () => {
        let listColors = [];
        colorsProduct.forEach(async (productColor) => {
          if (
            productColor.images.length > 0 &&
            productColor.imageMedium &&
            productColor.imageSmall
          ) {
            const data = new FormData();
            productColor.images.forEach((imageFile) => {
              data.append("images", imageFile);
            });
            data.append("imageMedium", productColor.imageMedium);
            data.append("imageSmall", productColor.imageSmall);
            try {
              const res = await axiosClient.post("/upload/products", data);
              if (res.files) {
                listColors.push({
                  ...productColor,
                  imageMedium: `/public/products/${res.files.imageMedium[0].filename}`,
                  imageSmall: `/public/products/${res.files.imageSmall[0].filename}`,
                  images: res.files.images.map(
                    (imageFile) => `/public/products/${imageFile.filename}`
                  ),
                });
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
        return listColors;
      };
      const newL = generateNewColors();
      setTimeout(async () => {
        try {
          const res = await productApi.createProduct({
            ...inputProduct,
            colors: newL,
          });
          if (res) {
            handleClearState();
            alert("Thêm thành công !");
          }
        } catch (error) {
          console.log(error);
        }
      }, 3000);
    } else {
      alert("Chưa điền đủ thông tin !");
    }
  };
  const handleClearState = () => {
    setColorsProduct([]);
    setInputProduct({
      name: "",
      price: "",
      discount: "",
      description: "",
      colors: [],
      brand: "",
      preserveInformation: "",
      deliveryReturnPolicy: "",
      category: "",
      keywords: [],
      gender: "",
    });
    setListKeyWords([]);
  };
  const handleAddColor = () => {
    if (
      inputColor.colorName !== "" &&
      inputColor.images.length > 0 &&
      inputColor.imageMedium &&
      inputColor.imageSmall
    ) {
      setColorsProduct((prev) => {
        let listImages = [];
        for (const key of Object.keys(inputColor.images)) {
          listImages.push(inputColor.images[key]);
        }
        return [
          ...prev,
          {
            ...inputColor,
            images: listImages,
            sizes: listSize,
          },
        ];
      });
      setInputColor({
        images: [],
        imageMedium: null,
        imageSmall: null,
        colorName: "",
      });
      setListSize([]);
    } else {
      alert("Vui lòng chọn ảnh !");
    }
  };
  const handleSaveSize = () => {
    if (size.size && size.quantity) {
      setListSize((prev) => [...prev, size]);
      setSize({ size: "", quantity: "" });
      sizeRef.current.focus();
    } else {
      alert("Bạn chưa nhập đủ thông tin về size !");
    }
  };
  const handleAddKeyWord = () => {
    if (keyword) {
      setListKeyWords((prev) => [...prev, keyword]);
      setKeyword("");
      inputKeywordRef.current.focus();
    } else {
      alert("Bạn chưa nhập từ khóa !");
    }
  };
  const handleRemoveItem = (item, list, cb) => {
    const newList = list.filter((listItem) => listItem !== item);
    cb(newList);
  };

  return (
    <>
      <div>
        <div className="form-add" action="">
          <div>
            <label htmlFor="">Tên sản phẩm:</label>
            <input
              type="text"
              value={inputProduct.name}
              onChange={(e) =>
                setInputProduct((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          <div>
            <label htmlFor="">Nhập mô tả:</label>
            <textarea
              name="desc"
              placeholder="Nhập mô tả sản phẩm"
              id=""
              value={inputProduct.description}
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              cols="30"
              rows="10"
            ></textarea>
          </div>
          <div>
            <label htmlFor="">Giá sản phẩm:</label>
            <input
              type="number"
              value={inputProduct.price}
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  price: e.target.value * 1,
                }))
              }
              placeholder="Nhập giá sản phẩm"
            />
          </div>

          <div>
            <label htmlFor="">Giảm giá:</label>
            <input
              type="number"
              value={inputProduct.discount}
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  discount: e.target.value * 1,
                }))
              }
              placeholder="Nhập phần trăm giảm giá"
            />
          </div>

          <div>
            <label htmlFor="">Chọn thương hiệu:</label>
            <select
              name="brand"
              id=""
              onChange={(e) =>
                setInputProduct((prev) => ({ ...prev, brand: e.target.value }))
              }
              defaultValue={inputProduct.brand}
            >
              <option value="" disabled>
                Sản phẩm này thuộc thương hiệu nào ?
              </option>
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
            <select
              name="category"
              id=""
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              defaultValue={inputProduct.category}
            >
              <option value="" disabled>
                Danh mục sản phẩm thuộc loại nào ?
              </option>
              {categoryList.length > 0 &&
                categoryList.map((category) => (
                  <option
                    // selected={category._id === inputProduct.category}
                    key={category._id}
                    value={category._id}
                  >
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
              value={inputProduct.preserveInformation}
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  preserveInformation: e.target.value,
                }))
              }
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
              value={inputProduct.deliveryReturnPolicy}
              onChange={(e) =>
                setInputProduct((prev) => ({
                  ...prev,
                  deliveryReturnPolicy: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div>
            <label htmlFor="">Chọn giới tính:</label>
            <select
              name="gender"
              id=""
              onChange={(e) =>
                setInputProduct((prev) => ({ ...prev, gender: e.target.value }))
              }
              defaultValue={inputProduct.gender}
            >
              <option value="" disabled>
                Sản phẩm dành cho ai ?
              </option>
              <option value="men">Nam</option>
              <option value="woman">Nữ</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div id="keyword">
            <label htmlFor="">Từ khóa sản phẩm</label>
            <div id="keyword-input">
              <input
                type="text"
                value={keyword}
                ref={inputKeywordRef}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button onClick={handleAddKeyWord}>Thêm</button>
            </div>
            <div id="key-rs-container">
              {listKeyWords.length > 0 &&
                listKeyWords.map((keyword, i) => (
                  <span
                    key={i}
                    onClick={() =>
                      handleRemoveItem(keyword, listKeyWords, setListKeyWords)
                    }
                  >
                    {keyword}
                  </span>
                ))}
            </div>
          </div>
          <div className="btn-add">
            <button onClick={handleCreateProduct}>Thêm product</button>
          </div>
        </div>
      </div>
      <div className="form-add">
        {" "}
        <div>
          <label htmlFor="">Màu sản phẩm:</label>
          <input
            type="text"
            value={inputColor.colorName}
            onChange={(e) =>
              setInputColor((prev) => ({ ...prev, colorName: e.target.value }))
            }
            placeholder="Nhập màu"
          />
        </div>
        <div>
          <label htmlFor="">Hình ảnh sản phẩm (chọn nhiều ảnh):</label>
          <input
            type="file"
            onChange={(e) =>
              setInputColor((prev) => ({ ...prev, images: e.target.files }))
            }
            multiple
          />
        </div>
        <div>
          <label htmlFor="">Hình ảnh trung bình (chọn 1 ảnh):</label>
          <input
            type="file"
            onChange={(e) =>
              setInputColor((prev) => ({
                ...prev,
                imageMedium: e.target.files[0],
              }))
            }
          />
        </div>
        <div>
          <label htmlFor="">Hình ảnh nhỏ (chọn 1 ảnh):</label>
          <input
            type="file"
            onChange={(e) =>
              setInputColor((prev) => ({
                ...prev,
                imageSmall: e.target.files[0],
              }))
            }
          />
        </div>
        <div className="add-color color-container">
          <div>
            <label htmlFor="">Kích cỡ:</label>
            <input
              type="text"
              ref={sizeRef}
              value={size.size}
              onChange={(e) =>
                setSize((prev) => ({ ...prev, size: e.target.value }))
              }
              placeholder="Nhập kích cỡ"
            />
          </div>
          <div>
            <label htmlFor="">Số lượng:</label>
            <input
              type="number"
              value={size.quantity}
              onChange={(e) =>
                setSize((prev) => ({ ...prev, quantity: e.target.value * 1 }))
              }
              placeholder="Nhập số lượng"
            />
          </div>
          <div className="size-container">
            {listSize.length > 0 &&
              listSize.map((size, index) => (
                <div
                  onClick={() => handleRemoveItem(size, listSize, setListSize)}
                  key={index}
                  className="size"
                >
                  <span>{`${size.size} | ${size.quantity}`}</span>
                </div>
              ))}
          </div>
          <button onClick={handleSaveSize}>OK</button>
        </div>
        <div className="btn-add">
          <button onClick={handleAddColor}>Lưu màu</button>
        </div>
      </div>
      {colorsProduct.length > 0 && (
        <div className="form-add result-color">
          {colorsProduct.length > 0 &&
            colorsProduct.map((item, i) => (
              <div
                onClick={() =>
                  handleRemoveItem(item, colorsProduct, setColorsProduct)
                }
                className="card-corner"
                key={i}
              >
                <span>Tên màu: {item.colorName}</span>
                <span>Hình ảnh chính: </span>
                <div id="image-container">
                  {item.images.map((image, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(image)}
                      alt=""
                      className="image-medium"
                    />
                  ))}
                </div>

                <div id="image-container">
                  <span>Hình ảnh trung bình:</span>
                  <img
                    src={URL.createObjectURL(item.imageMedium)}
                    alt=""
                    className="image-medium"
                  />
                </div>
                <div id="image-container">
                  <span>Hình ảnh nhỏ: </span>
                  <img
                    src={URL.createObjectURL(item.imageSmall)}
                    alt=""
                    className="image-small"
                  />
                </div>
                <span>Kích thước | Số lượng :</span>
                <div id="size-rs-container">
                  {item.sizes.length > 0 &&
                    item.sizes.map((size, index) => (
                      <div key={index} className="size">
                        <span>{`${size.size} | ${size.quantity}`}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
      <button onClick={handleLogout} className="logout">
        Đăng xuất
      </button>
    </>
  );
};

export default Home;
