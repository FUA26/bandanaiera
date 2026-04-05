import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { EnhancedImageUploader } from '../enhanced-image-uploader';

// Mock fetch for upload
const mockFetch = vi.fn();

global.fetch = mockFetch;

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
  writable: true,
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('EnhancedImageUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        file: {
          id: 'file-123',
          cdnUrl: 'https://cdn.example.com/image.jpg',
          serveUrl: '/api/files/file-123/serve',
        },
      }),
    });
  });

  it('should render upload zone', () => {
    render(
      <EnhancedImageUploader
        value={[]}
        onChange={vi.fn()}
        multiple={false}
      />
    );

    expect(screen.getByText(/upload image/i)).toBeInTheDocument();
  });

  it('should have file input', () => {
    render(
      <EnhancedImageUploader
        value={[]}
        onChange={vi.fn()}
        multiple={false}
      />
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input?.accept).toBe('image/jpeg,image/jpg,image/png,image/webp');
  });

  it('should allow file selection', async () => {
    const onChange = vi.fn();
    render(
      <EnhancedImageUploader
        value={[]}
        onChange={onChange}
        multiple={false}
      />
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await userEvent.upload(input, file);

    // Verify file was selected
    expect(input.files?.[0]).toBe(file);
  });
});
