import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ImageCropperModal } from '../image-cropper-modal';

describe('ImageCropperModal', () => {
  const mockOnCrop = vi.fn();
  const mockOnCancel = vi.fn();
  const mockImageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const mockPreview = 'data:image/jpeg;base64,test';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cropper modal when open', () => {
    render(
      <ImageCropperModal
        open={true}
        image={mockImageFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText(/crop image/i)).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <ImageCropperModal
        open={false}
        image={mockImageFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText(/crop image/i)).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    render(
      <ImageCropperModal
        open={true}
        image={mockImageFile}
        preview={mockPreview}
        onCrop={mockOnCrop}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel|batal/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
