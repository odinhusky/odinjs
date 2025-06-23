export interface ImageUploadProps {
  imageUrl?: string;
  maxCount?: number;
  className?: string;
  showBtn: boolean;
  disabled?: boolean;
  styles?: React.CSSProperties;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  onUpload: (file: File) => void;
}

export const defaultFileSize = 500 * 1024; // 默认 500KB
