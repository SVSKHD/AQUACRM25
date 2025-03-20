import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  featuredImage?: string;
  publishDate: string;
  readTime: number;
}

interface BlogState {
  items: Blog[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  items: [],
  loading: false,
  error: null
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.items = action.payload;
    },
    addBlog: (state, action: PayloadAction<Blog>) => {
      state.items.push(action.payload);
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const index = state.items.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteBlog: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  setLoading,
  setError
} = blogSlice.actions;

export default blogSlice.reducer;