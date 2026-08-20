// Generic admin list table (politicians, parties) — both pages had an
// identical header block and an identical table shell around different
// columns (a Rule 6 violation caught in review). Column definitions are
// passed in rather than duplicating the table structure per entity.
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
  align?: "left" | "right";
}

interface AdminEntityTableProps<T> {
  items: T[];
  keyFn: (item: T) => string;
  columns: Column<T>[];
  viewHref: (item: T) => string;
}

export function AdminEntityTable<T>({ items, keyFn, columns, viewHref }: AdminEntityTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header} className={col.align === "right" ? "text-right" : undefined}>
                {col.header}
              </TableHead>
            ))}
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={keyFn(item)}>
              {columns.map((col) => (
                <TableCell key={col.header} className={col.align === "right" ? "text-right" : undefined}>
                  {col.render(item)}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <Button href={viewHref(item)} variant="outline" size="sm">View Public Profile</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
