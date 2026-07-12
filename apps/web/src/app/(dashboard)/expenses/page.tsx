import { TransactionsTable } from '@/components/dashboard/transactions-table';
import { Flex, Heading } from '@radix-ui/themes';

export default function ExpensesPage() {
  return (
    <Flex direction="column" gap="5">
      <Heading size="6" className="font-display">
        Expenses
      </Heading>
      <TransactionsTable title="All expenses" pageSize={20} paginated />
    </Flex>
  );
}
