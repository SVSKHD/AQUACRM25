import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Invoice } from "@/services/invoices";

interface InvoiceState {
  items: Invoice[];
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  items: [],
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.items = action.payload;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.items.push(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setInvoices,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  setLoading,
  setError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
