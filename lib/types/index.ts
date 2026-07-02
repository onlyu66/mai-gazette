export interface LuuButRecord {
  id: number;
  created_at: string;
  noi_dung: string;
  tac_gia: string;
  anh_url: string | null;
}

export interface LuuButFormData {
  noiDung: string;
  tacGia: string;
  anhFile: Blob | null;
  anonymous: boolean;
}

export interface InsertLuuButDTO {
  noiDung: string;
  tacGia?: string;
  anhUrl: string | null;
}

export interface GalleryImageRecord {
  id: string;
  category: string;
  image_url: string;
  created_at: string;
  order_index: number;
}
