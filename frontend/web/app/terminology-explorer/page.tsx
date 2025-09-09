'use client';

import { useState } from 'react';

export default function TerminologyExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSystem, setSelectedSystem] = useState('Traditional Medicine System');
  const [selectedEquivalence, setSelectedEquivalence] = useState('Mapping Equivalence');
  const [selectedSection, setSelectedSection] = useState('ICD-11 Section');

  // Sample data matching the image
  const searchResults = [
    {
      code: 'NAMASTE-0001',
      displayName: 'Ayurvedic Concept 1',
      definition: 'Description of Ayurvedic Concept 1.',
      mappings: 'ICD-11: TM2-0001 (Exact Match)'
    },
    {
      code: 'NAMASTE-0002',
      displayName: 'Ayurvedic Concept 2',
      definition: 'Description of Ayurvedic Concept 2.',
      mappings: 'ICD-11: TM2-0002 (Narrower Match)'
    },
    {
      code: 'NAMASTE-0003',
      displayName: 'Ayurvedic Concept 3',
      definition: 'Description of Ayurvedic Concept 3.',
      mappings: 'ICD-11: TM2-0003 (Broad Match)'
    },
    {
      code: 'NAMASTE-0004',
      displayName: 'Ayurvedic Concept 4',
      definition: 'Description of Ayurvedic Concept 4.',
      mappings: 'ICD-11: TM2-0004 (No Match)'
    },
    {
      code: 'NAMASTE-0005',
      displayName: 'Ayurvedic Concept 5',
      definition: 'Description of Ayurvedic Concept 5.',
      mappings: 'ICD-11: TM2-0005 (Partial Match)'
    }
  ];

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
              <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">Home</a>
              <a href="/terminology-explorer" className="text-blue-600 font-medium">Terminology Explorer</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Mapping Tools</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Documentation</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 transition-colors">Support</a>
              
              {/* Help Icon */}
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              
              {/* User Avatar */}
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terminology Explorer</h1>
          <p className="text-lg text-gray-600">
            Search and browse NAMASTE codes, WHO International Terminologies for Ayurveda, and their ICD-11 mappings.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for codes, terms, or mappings"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-colors"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="mb-8 flex flex-wrap gap-4">
          {/* Traditional Medicine System */}
          <div className="relative">
            <select
              value={selectedSystem}
              onChange={(e) => setSelectedSystem(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option>Traditional Medicine System</option>
              <option>NAMASTE</option>
              <option>Ayurveda</option>
              <option>Unani</option>
              <option>Siddha</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Mapping Equivalence */}
          <div className="relative">
            <select
              value={selectedEquivalence}
              onChange={(e) => setSelectedEquivalence(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option>Mapping Equivalence</option>
              <option>Exact Match</option>
              <option>Narrower Match</option>
              <option>Broader Match</option>
              <option>Partial Match</option>
              <option>No Match</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* ICD-11 Section */}
          <div className="relative">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option>ICD-11 Section</option>
              <option>TM2 - Traditional Medicine</option>
              <option>Chapter 1</option>
              <option>Chapter 2</option>
              <option>Chapter 3</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Display Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Definition</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Mappings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.code}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        {result.displayName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.definition}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.mappings}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
