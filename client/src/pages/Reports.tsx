import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, FileText, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Reports = () => {
  const [dateRange, setDateRange] = useState('30days');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Use raw fetch to handle Blob downloading properly instead of simple axios JSON
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export?format=${format}&range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `issues_report_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Successfully downloaded ${format.toUpperCase()} report!`);
    } catch (error) {
      toast.error('Error generating report');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
        <p className="mt-1 text-sm text-slate-500">
          Generate, view, and export comprehensive analytics and activity reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Report Generator */}
        <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-primary-600" />
              Custom Report Generator
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Date Range</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="thisYear">This Year</option>
                    <option value="allTime">All Time</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Export Format</label>
                <div className="mt-2 flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={format === 'pdf'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="form-radio h-4 w-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">PDF Document</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="csv"
                      checked={format === 'csv'}
                      onChange={(e) => setFormat(e.target.value)}
                      className="form-radio h-4 w-4 text-primary-600 border-slate-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">CSV Excel</span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Reports / History */}
        <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Reports</h2>
            
            <ul className="divide-y divide-slate-200">
              <li className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Monthly Summary - June</p>
                    <p className="text-xs text-slate-500">PDF • Generated on Jun 30, 2026</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">Download</button>
              </li>
              <li className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-green-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Issues Export (All)</p>
                    <p className="text-xs text-slate-500">CSV • Generated on Jun 15, 2026</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">Download</button>
              </li>
              <li className="py-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Monthly Summary - May</p>
                    <p className="text-xs text-slate-500">PDF • Generated on May 31, 2026</p>
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">Download</button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
