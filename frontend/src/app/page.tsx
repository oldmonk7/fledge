'use client';

import { useEffect, useState } from 'react';
import { AggregateUsage, EmployeeWithFSA, User } from '@fledge/shared';
import { LoadingSpinner, Alert } from '@/components/ui';
import { apiClient } from '@/lib/api';
import AdminView from './AdminView';
import EmployeeView from './EmployeeView';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [aggregateData, setAggregateData] = useState<AggregateUsage | null>(null);
  const [employeeData, setEmployeeData] = useState<EmployeeWithFSA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        if (user.role === 'admin') {
          // Fetch aggregate data for admin
          const data = await apiClient.getAggregateUsage();
          setAggregateData(data);
        } else if (user.role === 'employee') {
          // For employees, we need the employee ID
          // First check if employee is in the user object
          if (user.employee?.id) {
            const data = await apiClient.getEmployeeWithFSA(user.employee.id);
            setEmployeeData(data);
          } else {
            // If employee relation is not loaded, try to find employee by user ID
            // This might happen if the employee relation wasn't included in the stored user
            setError('Employee account not found. Please contact your administrator.');
          }
        } else {
          setError('Unable to determine user role. Please contact your administrator.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading..." />
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

  // Admin view - Aggregate Usage
  if (user?.role === 'admin') {
    if (!aggregateData) {
      return (
        <div className="page-container">
          <p className="text-neutral-600 text-center">No aggregate data found</p>
        </div>
      );
    }

    return <AdminView aggregateData={aggregateData} />;
  }

  // Employee view - Personal FSA Account
  if (user?.role === 'employee') {
    if (!employeeData) {
      return (
        <div className="page-container">
          <p className="text-neutral-600 text-center">No FSA account data found. Please contact your administrator.</p>
        </div>
      );
    }

    return <EmployeeView employeeData={employeeData} user={user} />;
  }

  // Fallback for unknown role
  return (
    <div className="page-container">
      <Alert variant="error" title="Error">
        Unable to determine user role. Please contact your administrator.
      </Alert>
    </div>
  );
}
