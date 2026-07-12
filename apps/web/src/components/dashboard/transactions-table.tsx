'use client';

import { apiFetch } from '@/lib/api-client';
import { formatCurrency, formatDate } from '@/lib/format';
import { Badge, Button, Flex, Spinner, Table, Text } from '@radix-ui/themes';
import { API_ROUTES } from '@repo/config';
import type { ApiResponse, ICategory, IExpense, PaginatedResult } from '@repo/types';
import { useEffect, useState } from 'react';

export function TransactionsTable({
  title = 'Recent expenses',
  pageSize = 10,
  paginated = false,
}: {
  title?: string;
  pageSize?: number;
  paginated?: boolean;
}) {
  const [page, setPage] = useState(1);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [categories, setCategories] = useState<Record<string, ICategory>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: attempt is a refetch trigger, not read in the body
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      apiFetch<ApiResponse<PaginatedResult<IExpense>>>(
        `${API_ROUTES.EXPENSES.BASE}?page=${page}&pageSize=${pageSize}`,
      ),
      apiFetch<ApiResponse<PaginatedResult<ICategory>>>(
        `${API_ROUTES.CATEGORIES.BASE}?pageSize=100`,
      ),
    ])
      .then(([expensesJson, categoriesJson]) => {
        if (cancelled) return;
        if (!expensesJson.success) {
          setError(expensesJson.error.message);
          return;
        }
        setExpenses(expensesJson.data.items);
        setTotal(expensesJson.data.total);
        if (categoriesJson.success) {
          setCategories(Object.fromEntries(categoriesJson.data.items.map((c) => [c.id, c])));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load expenses.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, pageSize, attempt]);

  const empty = !loading && !error && expenses.length === 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Flex direction="column" gap="3">
      <Text size="4" weight="medium">
        {title}
      </Text>

      {loading && (
        <Flex justify="center" py="6">
          <Spinner size="3" />
        </Flex>
      )}

      {!loading && error && (
        <Flex direction="column" align="center" gap="2" py="6">
          <Text size="2" color="red">
            {error}
          </Text>
          <Button size="1" variant="soft" onClick={() => setAttempt((n) => n + 1)}>
            Retry
          </Button>
        </Flex>
      )}

      {!loading && !error && empty && (
        <Text size="2" color="gray">
          No expenses yet.
        </Text>
      )}

      {!loading && !error && !empty && (
        <>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell justify="end">Amount</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {expenses.map((expense) => {
                const category = categories[expense.categoryId];
                return (
                  <Table.Row key={expense.id}>
                    <Table.Cell>
                      {category ? (
                        <Badge color="gray" style={{ backgroundColor: `${category.color}22` }}>
                          {category.name}
                        </Badge>
                      ) : (
                        <Text size="2" color="gray">
                          —
                        </Text>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2">{expense.description ?? '—'}</Text>
                    </Table.Cell>
                    <Table.Cell>
                      <Text size="2" color="gray">
                        {formatDate(expense.date)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell justify="end">
                      <Text size="2" weight="medium" className="tabular-nums">
                        {formatCurrency(expense.amount, expense.currency)}
                      </Text>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>

          {paginated && totalPages > 1 && (
            <Flex align="center" justify="between">
              <Text size="2" color="gray">
                Page {page} of {totalPages}
              </Text>
              <Flex gap="2">
                <Button
                  size="1"
                  variant="soft"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="1"
                  variant="soft"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </Flex>
            </Flex>
          )}
        </>
      )}
    </Flex>
  );
}
