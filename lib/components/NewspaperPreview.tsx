import { ReactNode } from 'react';
import { LuuButFormData } from '../types';
import LuuButCard from './LuuButCard';

interface NewspaperPreviewProps {
  formData: LuuButFormData;
  formatDropCapText: (text: string) => ReactNode;
}

export default function NewspaperPreview({ formData, formatDropCapText }: NewspaperPreviewProps) {
  return (
    <LuuButCard
      tieuDe={formData.tieuDe}
      noiDung={formData.noiDung}
      tacGia={formData.tacGia}
      quaTang={formData.quaTang}
      anhFile={formData.anhFile}
      showPlaceholderImage={true}
      renderContent={
        formData.noiDung
          ? formatDropCapText(formData.noiDung)
          : undefined
      }
    />
  );
}