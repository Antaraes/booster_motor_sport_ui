import API from './interceptor';

export const getByMe = () => API.get('/me');

// Auth
export const login = (data: LoginFormValues) =>
  API.post('/auth/admin/sign-in', data);
export const forgotpassword = (data: any) =>
  API.post('/auth/admin/forget-password', data);
export const getProfile = () => API.get('/admin/profile');
export const updateProfile = (id: any, data: any) =>
  API.patch(`/admin/${id}`, data);

//user
export const signup_user = (data: any) => API.post('/auth/user/signup', data);
export const signin_user = (data: any) => API.post('/auth/user/signin', data);
export const get_user_profile = (data: any) => API.get('/user/profile', data);
export const updateUserProfile = (id: any, data: any) =>
  API.patch(`/user/${id}`, data);
export const verify_email = (token: any) =>
  API.get(`/auth/user/email-verification?token=${token}`);

//shipping address
export const addShippingAddress = (data: any) =>
  API.post('/customer/shipping_address', data);

//order
export const getUserOrderhistory = () => API.get('/order/history');

//checkout
export const addCheckout = (data: any) => API.post('/order/checkout', data);

//Member
export const memberList = () => API.get('/admin/list');
export const getMember = () => API.get('/admin/list');
export const addMember = (data: any) => API.post('/auth/admin/create', data);
export const memberDetail = (id: any) => API.get(`/admin/${id}`);

//role
export const getRoles = () => API.get('/admin/role');

//Category
export const addCategory = (data: any) => API.post('/category/add', data);
export const addSubcategory = (data: any) =>
  API.post('/category/sub-category', data);
export const getAllCategories = () => API.get('/category?q=true');
export const getBlogsbyCategory = (data: any, page: number, limit: number) =>
  API.get(`/category/${data}?page=${page}&limit=${limit}`);
export const getAllProductsbyCategory = (data: any, page: any) =>
  API.get(`/category/${data}?page=${page}&limit=8`);
export const getAllCategoriesWithProducts = () => API.get('/category?q=true');
export const updateCategory = (data: any, productId: any) =>
  API.patch(`/category/${productId}`, data);
export const deleteCategory = (productId: any) =>
  API.delete(`/category/${productId}`);

//Products
export const getAllProducts = () => API.get('/products');
export const getDetailProduct = (id: any) => API.get(`/product/${id}`);
export const addNewProduct = (data: any) => API.post('/product/add', data);
export const removeProduct = (id: any) => API.delete(`/product/${id}`);
export const updateProduct = (id: any, data: any) =>
  API.post(`/product/${id}`, data);
export const deleteImageProduct = (id: any) =>
  API.delete(`/product_images/${id}`);

export const getListofProducts = (subCategoryId: any) =>
  API.get(`/frontend/products?sub_categoryid=${subCategoryId}&sort_by=asc`);
export const getListofAllProducts = () =>
  API.get(`/frontend/products?sort_by=asc`);
export const getDetailUserProduct = (id: any) =>
  API.get(`/frontend/products/${id}`);
export const getSearchProduct = (
  page: string,
  limit: string,
  product: string,
  category?: string
) =>
  API.get(
    `/product/search?q=${product}&category=${category}&limit=${limit}&page=${page}`
  );

export const getProductByRankandView = (query: string) =>
  API.get(`/product?q=${query}`);
//Categories

//wishlist
export const addWishlist = (data: any) =>
  API.post(`/customer/wish-list/add`, data);
export const getWishlists = () => API.get('/customer/wish-list');
export const removeWishlist = (wishlistId: any) =>
  API.delete(`/customer/wish-list/${wishlistId}`);

//cart
export const getCartList = () => API.get('/cart');
export const addCartToDatabase = (data: any) => API.post('/cart/add', data);

//shipping-address
export const getShippingAddressList = () =>
  API.get('/customer/shipping-address');
export const updateShippingAddress = (data: any, id: any) =>
  API.patch(`/customer/shipping-address/${id}`, data);
export const deleteShippingAddress = (id: any) =>
  API.delete(`/customer/shipping-address/${id}`);
export const createShippingAddress = (data: any) =>
  API.post(`/customer/shipping-address/add`, data);
