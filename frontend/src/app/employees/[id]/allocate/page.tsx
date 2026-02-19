'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { EmployeeWithFSA } from '@fledge/shared';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { LoadingSpinner, Alert, Card, CardHeader, CardBody, Input, Button, ProgressBar } from '@/components/ui';

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
      <div className="page-container max-w-4xl">
        <LoadingSpinner size="lg" text="Loading account information..." />
      </div>
    );
  }

  if (error || !employeeData) {
    return (
      <div className="page-container max-w-4xl">
        <Alert variant="error" title="Error">
          {error || 'Employee data not found'}
        </Alert>
        <div className="mt-4">
          <Link href="/employees">
            <Button variant="ghost">← Back to Employees</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { fsaAccount } = employeeData;
  const remainingSpace = fsaAccount.annualLimit - fsaAccount.currentBalance;
  const usagePercentage = (fsaAccount.currentBalance / fsaAccount.annualLimit) * 100;

  return (
    <div className="page-container max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Allocate money to FSA Account</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {employeeData.firstName} {employeeData.lastName} - {fsaAccount.accountType}
          </p>
        </div>
        <Link href={`/employees/${id}`}>
          <Button variant="ghost">← Back to Account</Button>
        </Link>
      </div>

      {/* Account Summary */}
      <Card className="mb-6">
        <CardHeader title="Account Summary" />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-neutral-500">Annual Limit</dt>
              <dd className="mt-1 text-2xl font-semibold text-neutral-900">
                ${fsaAccount.annualLimit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-500">Current Balance</dt>
              <dd className="mt-1 text-2xl font-semibold text-primary-600">
                ${fsaAccount.currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-neutral-500">Remaining Space</dt>
              <dd className={`mt-1 text-2xl font-semibold ${remainingSpace >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                ${remainingSpace.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </dd>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-neutral-600 mb-2">
              <span>Usage: {usagePercentage.toFixed(1)}%</span>
              <span>Plan Year: {new Date(fsaAccount.planYearStart).getFullYear()}</span>
            </div>
            <ProgressBar
              value={usagePercentage}
              variant="primary"
              size="md"
            />
          </div>
        </CardBody>
      </Card>

      {/* Allocation Form */}
      <Card>
        <CardHeader title="Allocate money" />
        <CardBody>
          {allocationSuccess && (
            <Alert variant="success" className="mb-4">
              ✓ Funds allocated successfully!
            </Alert>
          )}

          {allocationError && (
            <Alert variant="error" className="mb-4">
              {allocationError}
            </Alert>
          )}

          <form onSubmit={handleAllocate} className="space-y-6">
            <Input
              label="Allocation Amount"
              type="number"
              id="amount"
              name="amount"
              step="0.01"
              min="0.01"
              max={remainingSpace}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              disabled={allocating || remainingSpace <= 0}
              leftIcon={<span>$</span>}
              rightIcon={<span>USD</span>}
              fullWidth
              helperText={`Maximum allocation: $${remainingSpace.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />

            <Input
              label="Description (Optional)"
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Monthly payroll contribution"
              disabled={allocating}
              fullWidth
            />

            {remainingSpace <= 0 && (
              <Alert variant="warning">
                Your FSA account has reached its annual limit. No further allocations can be made.
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Link href={`/employees/${id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={allocating || remainingSpace <= 0}
                isLoading={allocating}
              >
                Allocate money
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


