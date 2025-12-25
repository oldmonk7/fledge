'use client';

import { useEffect, useState } from 'react';
import { EmployeeWithFSA } from '@fledge/shared';

export default function Home() {
  const [employeeData, setEmployeeData] = useState<EmployeeWithFSA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // For demo purposes, we'll fetch the demo employee
        // Using the UUID from the database seed data
        const response = await fetch('/api/employees/a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789/account');

        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }

        const data = await response.json();
        setEmployeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No employee data found</p>
        </div>
      </div>
    );
  }

  const { fsaAccount } = employeeData;
  const remainingBalance = fsaAccount.annualLimit - fsaAccount.usedAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Employee Account Details</h2>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Employee Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-sm text-gray-900">{employeeData.firstName} {employeeData.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Employee ID</dt>
                  <dd className="text-sm text-gray-900">{employeeData.employeeId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{employeeData.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Department</dt>
                  <dd className="text-sm text-gray-900">{employeeData.department || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Hire Date</dt>
                  <dd className="text-sm text-gray-900">{new Date(employeeData.hireDate).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {/* FSA Account Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">DCFSA Account</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                  <dd className="text-sm text-gray-900">{fsaAccount.accountType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      fsaAccount.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : fsaAccount.status === 'inactive'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {fsaAccount.status.charAt(0).toUpperCase() + fsaAccount.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Plan Year</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(fsaAccount.planYearStart).getFullYear()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Annual Limit</dt>
                  <dd className="text-sm text-gray-900">${fsaAccount.annualLimit.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Used Amount</dt>
                  <dd className="text-sm text-gray-900">${fsaAccount.usedAmount.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Remaining Balance</dt>
                  <dd className={`text-sm font-semibold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remainingBalance.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Balance Summary Card */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Balance Summary</h4>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full"
                style={{
                  width: `${Math.min((fsaAccount.usedAmount / fsaAccount.annualLimit) * 100, 100)}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Used: ${fsaAccount.usedAmount.toLocaleString()}</span>
              <span>Remaining: ${remainingBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
