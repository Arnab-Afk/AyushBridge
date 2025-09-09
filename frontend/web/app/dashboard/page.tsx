'use client';

import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-900 rounded mr-3"></div>
            <span className="text-xl font-semibold text-gray-900">AyushBridge</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <a 
            href="#"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2v0z" />
            </svg>
            Dashboard
          </a>

          <a 
            href="#"
            onClick={() => setActiveTab('terminology')}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'terminology' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Terminology Explorer
          </a>

          <a 
            href="#"
            onClick={() => setActiveTab('harmonizer')}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'harmonizer' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Code Harmonizer
          </a>

          <a 
            href="#"
            onClick={() => setActiveTab('uploader')}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'uploader' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            FHIR Bundle Uploader
          </a>

          <a 
            href="#"
            onClick={() => setActiveTab('monitor')}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'monitor' 
                ? 'bg-gray-100 text-gray-900' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Activity Monitor
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* System Health Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">System Health Status</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* API Uptime */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">API Uptime</h3>
              <p className="text-3xl font-bold text-gray-900">100%</p>
            </div>

            {/* Sync Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Sync Status with WHO ICD-11</h3>
              <p className="text-3xl font-bold text-gray-900">Synced</p>
            </div>
          </div>
        </div>

        {/* Terminology Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Terminology Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Number of NAMASTE Terms */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Number of NAMASTE Terms</h3>
              <p className="text-3xl font-bold text-gray-900">12,500</p>
            </div>

            {/* Mapping Coverage */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Mapping Coverage</h3>
              <p className="text-3xl font-bold text-gray-900">95%</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Bundle Uploaded
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      2023-11-15 10:30 AM
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Translation Completed
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      2023-11-14 04:15 PM
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      Code Harmonization
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      2023-11-13 09:00 AM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
