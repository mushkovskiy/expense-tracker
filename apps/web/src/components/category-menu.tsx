'use client';

import { apiFetch } from '@/lib/api-client';
import { Box, Card, Flex, Grid, Heading, Link, Text } from '@radix-ui/themes';
import { API_ROUTES } from '@repo/config';
import type { ApiResponse, ICategory, PaginatedResult } from '@repo/types';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

export function CategoryMenu() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiFetch<ApiResponse<PaginatedResult<ICategory>>>(`${API_ROUTES.CATEGORIES.BASE}?pageSize=100`)
      .then((json) => {
        if (cancelled) return;
        if (!json.success) {
          setError(json.error.message);
          return;
        }
        setCategories(json.data.items);
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load categories');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Box>
      <Heading size="4" mb="3">
        Categories
      </Heading>

      {loading && (
        <Text color="gray" size="2">
          Loading categories…
        </Text>
      )}

      {!loading && error && (
        <Text color="red" size="2">
          {error}
        </Text>
      )}

      {!loading && !error && categories.length === 0 && (
        <Text size="2">
          No categories yet.{' '}
          <Link asChild>
            <NextLink href="/categories">Create your first category</NextLink>
          </Link>
        </Text>
      )}

      {!loading && !error && categories.length > 0 && (
        <Grid columns={{ initial: '2', sm: '3', md: '4' }} gap="3">
          {categories.map((category) => (
            <Card key={category.id} asChild style={{ cursor: 'pointer' }}>
              <NextLink href={`/expenses?category=${encodeURIComponent(category.id)}`}>
                <Flex direction="column" align="center" gap="2" p="1">
                  <Box
                    width="2rem"
                    height="2rem"
                    style={{ borderRadius: '9999px', backgroundColor: category.color }}
                  />
                  <Text size="2" align="center">
                    {category.icon ? `${category.icon} ` : ''}
                    {category.name}
                  </Text>
                </Flex>
              </NextLink>
            </Card>
          ))}
        </Grid>
      )}
    </Box>
  );
}
