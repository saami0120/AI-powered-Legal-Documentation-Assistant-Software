import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { validateDocument } from '../services/documentValidationService';

export default function DocumentValidator() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationResults, setValidationResults] = useState(null);
  const [error, setError] = useState('');

  // Add debug logging
  useEffect(() => {
    console.log('DocumentValidator mounted');
  }, []);

  const handleFileChange = (e) => {
    console.log('File change event:', e.target.files[0]);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit event triggered');
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsAnalyzing(true);
    setValidationResults(null);
    setError('');

    try {
      console.log('Starting document validation');
      const results = await validateDocument(file);
      console.log('Validation results:', results);
      setValidationResults(results);
    } catch (err) {
      console.error('Validation error:', err);
      setError('Error analyzing document. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add error boundary
  if (error) {
    console.error('Component error:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-400 to-dark-100">
      <div className="max-w-4xl mx-auto my-16">
        <div className="glass-effect rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary-400" /> Document Validator
              </h2>
              <p className="text-gray-400 mt-2">Upload your legal document for AI-powered analysis</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-gray-300 mb-2">Upload your legal document</p>
                  <p className="text-sm text-gray-400 mb-4">Only PDF files are accepted</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg cursor-pointer hover:bg-primary-500/20 transition"
                  >
                    Choose File
                  </label>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <FileText className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing Document...' : 'Validate Document'}
            </button>
          </form>

          {/* Validation Results */}
          {validationResults && (
            <div className="mt-8 space-y-6">
              <div className="glass-effect rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary-400" /> Document Analysis
                </h3>
                
                {/* Overall Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Overall Document Health</span>
                    <span className={`text-lg font-medium ${
                      validationResults.score >= 80 ? 'text-green-400' :
                      validationResults.score >= 60 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {validationResults.score}%
                    </span>
                  </div>
                  <div className="h-2 bg-dark-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        validationResults.score >= 80 ? 'bg-green-500' :
                        validationResults.score >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${validationResults.score}%` }}
                    />
                  </div>
                </div>

                {/* Issues Section */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-white mb-4">Issues Found</h4>
                  <div className="space-y-4">
                    {validationResults.issues.map((issue, index) => (
                      <div key={index} className="bg-dark-300 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-1 ${
                            issue.severity === 'high' ? 'text-red-400' :
                            issue.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="text-white font-medium">{issue.title}</h5>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                issue.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {issue.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-400">{issue.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations Section */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Recommendations</h4>
                  <div className="space-y-4">
                    {validationResults.recommendations.map((rec, index) => (
                      <div key={index} className="bg-dark-300 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                          <div>
                            <h5 className="text-white font-medium mb-2">{rec.title}</h5>
                            <p className="text-gray-400">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 