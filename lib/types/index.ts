export interface LuuButRecord {
  id: number;
  created_at: string;
  tieu_de: string;
  noi_dung: string;
  tac_gia: string;
  qua_tang: string;
  anh_url: string | null;
}

export interface LuuButFormData {
  tieuDe: string;
  noiDung: string;
  tacGia: string;
  quaTang: string;
  anhFile: Blob | null;
}

export interface InsertLuuButDTO {
  tieuDe: string;
  noiDung: string;
  tacGia?: string;
  quaTang: string;
  anhUrl: string | null;
}

export interface GalleryImageRecord {
  id: string;
  category: string;
  image_url: string;
  created_at: string;
  order_index: number;
}
