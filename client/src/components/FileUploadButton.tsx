import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, FileIcon, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  selectedFile?: File | null;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
}

export function FileUploadButton({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled = false,
  maxSizeMB = 10,
  accept = 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt',
}: FileUploadButtonProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: 'ファイルサイズエラー',
        description: `ファイルサイズは${maxSizeMB}MB以下にしてください`,
        variant: 'destructive',
      });
      return;
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onFileSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove?.();
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!selectedFile ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleButtonClick}
          disabled={disabled}
          className="h-9 w-9"
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      ) : (
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
          {preview ? (
            <div className="flex items-center gap-2">
              <img
                src={preview}
                alt="Preview"
                className="h-8 w-8 rounded object-cover"
              />
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[150px]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[150px]">
                  {selectedFile.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </span>
              </div>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
            className="h-6 w-6 ml-1"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
