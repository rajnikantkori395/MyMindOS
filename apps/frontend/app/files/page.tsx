/**
 * Files Page
 * File management and upload interface
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  useGetFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
  useGetStorageUsageQuery,
  type FileResponse,
} from '@/lib/api/fileApi';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Alert,
  AlertDescription,
} from '@/components/common';
import Link from 'next/link';

export default function FilesPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: filesData, isLoading: isLoadingFiles } = useGetFilesQuery({
    page,
    limit: 20,
  });

  const { data: storageUsage, isLoading: isLoadingStorage } = useGetStorageUsageQuery();

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteFileMutation();

  if (!isAuthenticated) {
    router.push('/signin');
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await uploadFile(formData).unwrap();
      setSelectedFile(null);
      setUploadError(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error: any) {
      setUploadError(
        error?.data?.message || error?.message || 'Failed to upload file',
      );
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteFile(fileId).unwrap();
    } catch (error: any) {
      alert(error?.data?.message || 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatStorageUsage = (bytes: number) => {
    return formatFileSize(bytes);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Files</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your uploaded files
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        {/* Storage Usage */}
        {!isLoadingStorage && storageUsage && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used:</span>
                  <span className="font-medium">
                    {formatStorageUsage(storageUsage.totalBytes)} /{' '}
                    {formatStorageUsage(storageUsage.limitBytes)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Files:</span>
                  <span className="font-medium">{storageUsage.totalFiles}</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${
                        (storageUsage.totalBytes / storageUsage.limitBytes) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>
              Upload files to your storage (max 100MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {selectedFile && (
                <div className="rounded-md border border-border bg-muted p-3">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              )}
              {uploadError && (
                <Alert variant="destructive">
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                isLoading={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
            <CardDescription>
              {filesData?.total || 0} file{filesData?.total !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFiles ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading files...
              </div>
            ) : filesData?.data && filesData.data.length > 0 ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {filesData.data.map((file: FileResponse) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-md border border-border bg-card p-4"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{file.filename}</p>
                        <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          <span>{file.type}</span>
                          <span
                            className={`capitalize ${
                              file.status === 'processed'
                                ? 'text-green-600'
                                : file.status === 'failed'
                                  ? 'text-red-600'
                                  : ''
                            }`}
                          >
                            {file.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {file.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                          >
                            Download
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(file.id)}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {filesData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page} of {filesData.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(filesData.totalPages, p + 1))
                      }
                      disabled={page === filesData.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No files uploaded yet. Upload your first file above!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
