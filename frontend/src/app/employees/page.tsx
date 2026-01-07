'use client';

import { useEffect, useState } from 'react';
import { Employee } from '@fledge/shared';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import { LoadingSpinner, Alert, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Button, Card } from '@/components/ui';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiClient.getAllEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading employees..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Employees</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {employees.length} {employees.length === 1 ? 'employee' : 'employees'} found
          </p>
        </div>
        <Link href="/">
          <Button variant="ghost">← Back to Home</Button>
        </Link>
      </div>

      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>FSA Accounts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-neutral-500">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="text-sm font-medium text-neutral-900">
                      {employee.firstName} {employee.lastName}
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{employee.fsaAccounts?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/employees/${employee.id}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

