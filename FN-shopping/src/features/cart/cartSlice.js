import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try{
      const response =await api.post("/cart",{productId:id,size,qty:1});
      if(response.status !== 200)
        throw new Error(response.error);
      dispatch(
        showToastMessage({
          message:"카트에 아이템이 추가 되었습니다!!",
          status: "success",
        })
      );
      return response.data.cartItemQty;

    }catch(error){
      dispatch(
        showToastMessage({
          message:"카트에 아이템 추가 실패!!",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response =await api.get("/cart");
      console.log("API Response:", response);
      if(response.status !== 200)
        throw new Error(response.error);
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);
      if (response.status !== 200) throw new Error(response.error);

      dispatch(
        showToastMessage({
          message: "카트 아이템이 삭제되었습니다.",
          status: "success",
        })
      );
       // 목록 새로고침
            dispatch(getCartList({ page: 1 }));
            
      return response.data.cartItemQty; // 삭제된 후 카트 아이템 개수 반환
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "카트 아이템 삭제 실패.",
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      if (response.status !== 200) throw new Error(response.error);
      return response.data.data; // 업데이트된 카트 데이터 반환
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart/qty");
      if (response.status !== 200) throw new Error(response.error);
      return response.data.qty; // 카트의 수량 반환
    } catch (error) {
      dispatch(showToastMessage({message: error,status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder
    .addCase(addToCart.pending,(state,action)=>{
      state.loading =true;
    })
    .addCase(addToCart.fulfilled,(state,action)=>{
      state.loading = false;
      state.error ="";
      state.cartItemCount= action.payload;

    })
    .addCase(addToCart.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getCartList.pending,(state,action)=>{
      state.loading =true;
    })
    .addCase(getCartList.fulfilled,(state,action)=>{
      state.loading = false;
      state.error ="";
      state.cartList = action.payload;
      state.totalPrice = action.payload.reduce(
        (total,item)=>total+item.productId.price*item.qty,0);
      
    })
    .addCase(getCartList.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
      
    })
    .addCase(deleteCartItem.pending, (state) => {
      state.loading = true;
    })
    .addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItemCount = action.payload; // 업데이트된 카트 아이템 개수
    })
    .addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateQty.pending, (state) => {
      state.loading = true;
    })
    .addCase(updateQty.fulfilled, (state, action) => {
      state.loading = false;
      state.cartList = action.payload; // 업데이트된 카트 데이터
    })
    .addCase(updateQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getCartQty.pending, (state) => {
      state.loading = true;
    })
    .addCase(getCartQty.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItemCount = action.payload; // 카트 아이템 수량
    })
    .addCase(getCartQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
