import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { materialApi } from '../../api/client';
import { UploadedMaterial } from '../../types';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  X,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

export const MaterialsUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [materials, setMaterials] = useState<UploadedMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<UploadedMaterial | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const data = await materialApi.getAllMaterials();
      setMaterials(data);
    } catch (err) {
      console.error('Error fetching materials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.pptx', '.txt'];
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setUploadError('Invalid file format. Please upload a PDF, DOCX, PPTX, or TXT file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB limit
      setUploadError('File exceeds the maximum permitted size of 20 MB.');
      setSelectedFile(null);
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    try {
      const result = await materialApi.uploadMaterial(selectedFile);
      setUploadSuccess(`"${result.fileName}" successfully uploaded, parsed, and text extracted!`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchMaterials();
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error('Upload failed', err);
      setUploadError(err.response?.data?.message || 'Failed to process and extract text from the file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-slate-900">Learning Materials & Document Ingestion</h1>
          <span className="bg-blue-100 text-gov-blue text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
            Pipeline: Ingest &bull; Extract &bull; Chunk &bull; Synthesize
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Upload official MoSPI statistical manuals, survey instructions, or training handbooks for automated AI extraction.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Upload New Material</h2>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragActive
              ? 'border-gov-blue bg-indigo-50/50'
              : selectedFile
              ? 'border-emerald-300 bg-emerald-50/20'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.pptx,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm text-gov-blue mx-auto flex items-center justify-center">
              <UploadCloud className="w-6 h-6" />
            </div>

            {selectedFile ? (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Selected File: {selectedFile.name}
                </span>
                <p className="text-xs text-slate-500">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for AI extraction
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Drag and drop your statistical document here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gov-blue hover:text-gov-navy underline"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, DOCX, PPTX, TXT (Maximum file size: 20 MB)
                </p>
              </div>
            )}

            {/* Supported extensions chips */}
            <div className="flex items-center justify-center space-x-2 pt-2">
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                .PDF
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                .DOCX
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                .PPTX
              </span>
              <span className="font-mono text-[10px] uppercase font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                .TXT
              </span>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {selectedFile && (
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="inline-flex items-center px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 mr-2 ${uploading ? 'animate-bounce' : ''}`} />
              {uploading ? 'Extracting Text & Cleaning...' : 'Process Document & Extract Text'}
            </button>
          </div>
        )}
      </div>

      {/* Materials List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Ingested Training Repository</h2>
            <p className="text-xs text-slate-500">Documents available for automated MCQ generation</p>
          </div>
          <span className="text-xs font-semibold text-slate-500">{materials.length} total files</span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-gov-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : materials.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No materials uploaded yet. Use the upload box above to ingest files.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {materials.map((mat) => (
              <div
                key={mat.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-2 rounded-xl transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-gov-blue flex items-center justify-center font-mono font-bold text-xs uppercase flex-shrink-0">
                    {mat.fileType}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mat.fileName}</h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                      <span>{(mat.fileSize / 1024).toFixed(1)} KB</span>
                      <span>&bull;</span>
                      <span>{mat.characterCount || 0} characters parsed</span>
                      <span>&bull;</span>
                      <span>Uploaded by: {mat.uploaderName || 'Trainer'}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-semibold">{mat.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  {mat.previewText && (
                    <button
                      onClick={() => setPreviewMaterial(mat)}
                      className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors flex items-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/trainer/generator', { state: { materialId: mat.id } })}
                    className="px-3 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" /> Synthesize MCQs
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-slate-400">Extracted Text Content</span>
                <h3 className="text-sm font-bold text-slate-900">{previewMaterial.fileName}</h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
              {previewMaterial.previewText}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Total characters: {previewMaterial.characterCount}
              </span>
              <button
                onClick={() => {
                  const mId = previewMaterial.id;
                  setPreviewMaterial(null);
                  navigate('/trainer/generator', { state: { materialId: mId } });
                }}
                className="px-4 py-2 bg-gov-blue text-white text-xs font-bold rounded-xl"
              >
                Generate MCQs from this Document &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
