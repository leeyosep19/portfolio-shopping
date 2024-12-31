import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try{
      const response = await api.get("/product",{params:{...query}});
      console.log("page",response)
      if(response.status !== 200)
        throw new Error (response.error);
      return response.data;
    }catch(error){
      rejectWithValue(error.error);
    }
  }
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${id}`);
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("product",formData)
      if(response.status!==200) 
        throw new Error(response.error);
      dispatch(showToastMessage({message:"상품 생성 완료",stautus:"success"}));
      dispatch(getProductList({page:1}));  // 완료후 페이지 에 Refresh 없이 바로보이게 
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/product/${id}`);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
      // 성공 메시지 디스패치
      dispatch(
        showToastMessage({
          message: "상품삭제 완료",
          status: "error",
        })
      );
      // 목록 새로고침
      dispatch(getProductList({ page: 1 }));
      return response.data.message;
    } catch (error) {
      // 에러 메시지 디스패치
      return rejectWithValue(error.error);
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
      try{
        const response = await api.put(`/product/${id}`, formData)
        if(response.status!==200)
          throw new Error(response.error);
        dispatch(getProductList({page:1}));
        return response.data.data;
        
      }catch(error){
        return rejectWithValue(error.error);
      }
  }
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending,(state,action)=>{
      state.loading=true;
    })
   .addCase(createProduct.fulfilled,(state,action)=>{
      state.loading=false;
      state.error="";
      state.success=true;
    })
    .addCase(createProduct.rejected,(state,action)=>{
      state.loading=false;
      state.error= action.payload;
      state.success = false;
    })
    .addCase(getProductList.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(getProductList.fulfilled,(state,action)=>{
      state.loading=false;
      state.productList =action.payload.data;
      state.success = "";
      state.totalPageNum=action.payload.totalPageNum;
    })
    .addCase(getProductList.rejected,(state,action)=>{
      state.loading=false;
      state.success = action.payload;
    })
    .addCase(editProduct.pending,(state,action)=>{
      state.loading=true;
    })
    .addCase(editProduct.fulfilled,(state,action)=>{
      state.loading=false;
      state.success = "";
      state.success=true;
    })
    .addCase(editProduct.rejected,(state,action)=>{
      state.loading=false;      
      state.success = action.payload;
      state.success=false;
    })
    .addCase(getProductDetail.pending, (state) => {
      state.loading = true;
    })
    .addCase(getProductDetail.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    })
    .addCase(getProductDetail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });


  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
