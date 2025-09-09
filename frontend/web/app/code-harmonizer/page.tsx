'use client';

import { useState } from 'react';

export default function CodeHarmonizerPage() {
  const [sourceCode, setSourceCode] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('');
  const [translationResults, setTranslationResults] = useState([]);

  // Sample translation results
  const sampleResults = [
    {
      code: 'NAMASTE-001',
      displayName: 'Fever',
      equivalence: 'Exact',
      confidence: '0.95'
    },
    {
      code: 'ICD-11-TM2-002',
      displayName: 'High Temperature',
      equivalence: 'Narrower',
      confidence: '0.85'
    },
    {
      code: 'ICD-11-Biomed-003',
      displayName: 'Pyrexia',
      equivalence: 'Broad',
      confidence: '0.75'
    }
  ];

  const handleTranslate = () => {
    if (sourceCode && selectedSystem) {
      setTranslationResults(sampleResults);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded mr-3"></div>
              <span className="text-xl font-semibold text-gray-900">AyushBridge</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-blue-600 font-medium">Code Harmonizer</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Mapping Management</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Terminology Server</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Documentation</a>
              
              {/* Help Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Code Harmonizer</h1>
          <p className="text-lg text-gray-600">
            Translate codes between NAMASTE, ICD-11 TM2, and ICD-11 Biomedicine
          </p>
        </div>

        {/* Source Code Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Source Code</h2>
          
          <div className="space-y-6">
            {/* Code Input */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <input
                id="code"
                type="text"
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                placeholder="Enter code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            {/* System Dropdown */}
            <div>
              <label htmlFor="system" className="block text-sm font-medium text-gray-700 mb-2">
                System
              </label>
              <div className="relative">
                <select
                  id="system"
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select system</option>
                  <option value="namaste">NAMASTE</option>
                  <option value="icd11-tm2">ICD-11 TM2</option>
                  <option value="icd11-biomedicine">ICD-11 Biomedicine</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Translate Button */}
            <div>
              <button
                onClick={handleTranslate}
                disabled={!sourceCode || !selectedSystem}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Translate
              </button>
            </div>
          </div>
        </div>

        {/* Target Codes Section */}
        {translationResults.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Target Code(s)</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Code</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Display Name</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Equivalence</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {translationResults.map((result, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                          {result.code}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {result.displayName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.equivalence}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {result.confidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {translationResults.length === 0 && sourceCode && selectedSystem && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No translations found</h3>
            <p className="text-gray-500">Try a different code or system combination.</p>
          </div>
        )}
      </main>
    </div>
  );
}
