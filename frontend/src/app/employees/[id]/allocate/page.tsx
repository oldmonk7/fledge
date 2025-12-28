'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmployeeWithFSA } from '@fledge/shared';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function AllocatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [employeeData, setEmployeeData] = useState<EmployeeWithFSA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [allocationError, setAllocationError] = useState<string | null>(null);
  const [allocationSuccess, setAllocationSuccess] = useState(false);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const data = await apiClient.getEmployeeWithFSA(id);
        setEmployeeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocationError(null);
    setAllocationSuccess(false);

    if (!employeeData?.fsaAccount) {
      setAllocationError('FSA account not found');
      return;
    }

    const allocationAmount = parseFloat(amount);
    
    if (isNaN(allocationAmount) || allocationAmount <= 0) {
      setAllocationError('Please enter a valid amount greater than 0');
      return;
    }

    const remainingSpace = employeeData.fsaAccount.annualLimit - employeeData.fsaAccount.currentBalance;
    if (allocationAmount > remainingSpace) {
      setAllocationError(
        `Allocation amount exceeds remaining space. Maximum allocation: $${remainingSpace.toFixed(2)}`
      );
      return;
    }

    setAllocating(true);

    try {
      const updatedAccount = await apiClient.allocateToFSA(
        employeeData.fsaAccount.id,
        allocationAmount,
        description || undefined
      );
      
      // Update the employee data with the new account balance
      setEmployeeData({
        ...employeeData,
        fsaAccount: updatedAccount,
      });
      
      setAllocationSuccess(true);
      setAmount('');
      setDescription('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setAllocationSuccess(false);
      }, 3000);
    } catch (err) {
      setAllocationError(err instanceof Error ? err.message : 'Failed to allocate funds');
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading account information...</p>
        </div>
      </div>
    );
  }

  if (error || !employeeData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">Error: {error || 'Employee data not found'}</p>
          </div>
          <div className="mt-4">
            <Link
              href="/employees"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Back to Employees
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { fsaAccount } = employeeData;
  const remainingSpace = fsaAccount.annualLimit - fsaAccount.currentBalance;
  const usagePercentage = (fsaAccount.currentBalance / fsaAccount.annualLimit) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Allocate Funds to FSA Account</h1>
          <p className="mt-1 text-sm text-gray-500">
            {employeeData.firstName} {employeeData.lastName} - {fsaAccount.accountType}
          </p>
        </div>
        <Link
          href={`/employees/${id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Account
        </Link>
      </div>

      {/* Account Summary */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Account Summary</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Annual Limit</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                ${fsaAccount.annualLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Balance</dt>
              <dd className="mt-1 text-2xl font-semibold text-blue-600">
                ${fsaAccount.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Remaining Space</dt>
              <dd className={`mt-1 text-2xl font-semibold ${remainingSpace >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${remainingSpace.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Usage: {usagePercentage.toFixed(1)}%</span>
              <span>Plan Year: {new Date(fsaAccount.planYearStart).getFullYear()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full flex items-center justify-end pr-2"
                style={{
                  width: `${Math.min(usagePercentage, 100)}%`
                }}
              >
                {usagePercentage > 5 && (
                  <span className="text-xs font-semibold text-white">
                    {usagePercentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Allocation Form */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Allocate Funds</h2>
        </div>
        <div className="px-6 py-6">
          {allocationSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium">✓ Funds allocated successfully!</p>
            </div>
          )}

          {allocationError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{allocationError}</p>
            </div>
          )}

          <form onSubmit={handleAllocate} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Allocation Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  step="0.01"
                  min="0.01"
                  max={remainingSpace}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="0.00"
                  required
                  disabled={allocating || remainingSpace <= 0}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum allocation: ${remainingSpace.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (Optional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Monthly payroll contribution"
                  disabled={allocating}
                />
              </div>
            </div>

            {remainingSpace <= 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <p className="text-yellow-800 text-sm">
                  Your FSA account has reached its annual limit. No further allocations can be made.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href={`/employees/${id}`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={allocating || remainingSpace <= 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allocating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Allocating...
                  </span>
                ) : (
                  'Allocate Funds'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

