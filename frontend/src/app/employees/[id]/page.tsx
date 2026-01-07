'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmployeeWithFSA } from '@fledge/shared';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { LoadingSpinner, Alert, Card, CardHeader, CardBody, Badge, ProgressBar, Button } from '@/components/ui';

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [employeeData, setEmployeeData] = useState<EmployeeWithFSA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading employee details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="error" title="Error">
          {error}
        </Alert>
        <div className="mt-4">
          <Link href="/employees">
            <Button variant="ghost">← Back to Employees</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="page-container">
        <p className="text-neutral-600 text-center">No employee data found</p>
        <div className="mt-4">
          <Link href="/employees">
            <Button variant="ghost">← Back to Employees</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { fsaAccount } = employeeData;
  const remainingBalance = fsaAccount.annualLimit - fsaAccount.usedAmount;
  const usagePercentage = (fsaAccount.usedAmount / fsaAccount.annualLimit) * 100;

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'neutral';
      default:
        return 'error';
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Employee Details</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {employeeData.firstName} {employeeData.lastName}
          </p>
        </div>
        <Link href="/employees">
          <Button variant="ghost">← Back to Employees</Button>
        </Link>
      </div>

      <Card>
        <CardHeader title="Employee Account Details" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Information */}
            <div>
              <h3 className="text-md font-medium text-neutral-900 mb-4">Employee Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Name</dt>
                  <dd className="text-sm text-neutral-900">{employeeData.firstName} {employeeData.lastName}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Employee ID</dt>
                  <dd className="text-sm text-neutral-900">{employeeData.employeeId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Email</dt>
                  <dd className="text-sm text-neutral-900">{employeeData.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Department</dt>
                  <dd className="text-sm text-neutral-900">{employeeData.department || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Hire Date</dt>
                  <dd className="text-sm text-neutral-900">{new Date(employeeData.hireDate).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>

            {/* FSA Account Information */}
            <div>
              <h3 className="text-md font-medium text-neutral-900 mb-4">DCFSA Account</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Account Type</dt>
                  <dd className="text-sm text-neutral-900">{fsaAccount.accountType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Status</dt>
                  <dd className="text-sm text-neutral-900">
                    <Badge variant={getStatusBadgeVariant(fsaAccount.status) as any}>
                      {fsaAccount.status.charAt(0).toUpperCase() + fsaAccount.status.slice(1)}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Plan Year</dt>
                  <dd className="text-sm text-neutral-900">
                    {new Date(fsaAccount.planYearStart).getFullYear()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Annual Limit</dt>
                  <dd className="text-sm text-neutral-900">${fsaAccount.annualLimit.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Used Amount</dt>
                  <dd className="text-sm text-neutral-900">${fsaAccount.usedAmount.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-neutral-500">Remaining Balance</dt>
                  <dd className={`text-sm font-semibold ${remainingBalance >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    ${remainingBalance.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Balance Summary Card */}
          <div className="mt-6 bg-neutral-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-neutral-900 mb-2">Balance Summary</h4>
            <ProgressBar
              value={usagePercentage}
              variant="primary"
              size="md"
            />
            <div className="flex justify-between text-xs text-neutral-600 mt-2">
              <span>Used: ${fsaAccount.usedAmount.toLocaleString()}</span>
              <span>Remaining: ${remainingBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Allocation Action */}
          {fsaAccount.status === 'active' && (
            <div className="mt-6 flex justify-end">
              <Link href={`/employees/${id}/allocate`}>
                <Button variant="primary" leftIcon={
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }>
                  Allocate Funds
                </Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

