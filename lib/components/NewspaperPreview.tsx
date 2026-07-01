import { memo, ReactNode } from 'react';
import { LuuButFormData } from '../types';
import LuuButCard from './LuuButCard';

interface NewspaperPreviewProps {
  formData: LuuButFormData;
  formatDropCapText: (text: string) => ReactNode;
}

const NewspaperPreview = memo(function NewspaperPreview({ formData, formatDropCapText }: NewspaperPreviewProps) {
  return (
    <LuuButCard
      noiDung={formData.noiDung}
      tacGia={formData.tacGia}
      anhFile={formData.anhFile}
      showPlaceholderImage={true}
      renderContent={
        formData.noiDung
          ? formatDropCapText(formData.noiDung)
          : undefined
      }
    />
  );
});

export default NewspaperPreview;