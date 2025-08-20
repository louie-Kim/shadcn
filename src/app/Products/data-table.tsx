"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/TablePagination";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
// 테이블 최종렌더링 컴포넌트
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  });

  console.log("rowSelection>>>>>>>>>>>", rowSelection); // { 1 : true, 5: true ... } 

  // console.log(table);
  return (
    <div className="rounded-md border">
      {/* 체크박스 선택시 보임 */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md m-4 cursor-pointer">
            <Trash2 className="w-4 h-4"/>
            Delete Product(s)
          </button>
        </div>
      )}
      <Table>
        <TableHeader>
          {/* 테이블 헤더 */}
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {/* header.column.columnDef.header : columns.tsx :  header: ({ }) => {} 호출
                        header.getContext() : column 전달 */}
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            //  data 기반 row 생성 => columns.tsx  cell: ({ row }) 로 전달 =>
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {/* 받은 data 기반,
                        columns.tsx에서 정의한 cell 함수 호출
                        cell.column.columnDef.cell → columns.tsx에서 정의한 cell: ({  }) => {...} 호출
                        cell.getContext(): row 전달 */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
      <DataTablePagination table={table} />
    </div>
  );
}

/**
   * columns.ts에서 테이블 컬럼 columns를 정의

      getData()를 통해 Payment[] 형태의 데이터를 준비

      PaymentsPage에서 columns와 data를 DataTable에 prop으로 전달

      DataTable은 useReactTable를 통해 테이블 로직을 생성하고 렌더링
   */
