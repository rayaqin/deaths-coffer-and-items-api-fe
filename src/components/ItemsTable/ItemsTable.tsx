import { useTable, usePagination, useSortBy, useFilters } from "react-table"
import { matchSorter } from "match-sorter"
import { useMemo } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import { PiCaretUpBold } from "react-icons/pi"
import { MdOutlineSort } from "react-icons/md"
import "./ItemsTable.scss"

interface ItemsTableProps {
  columns: any[]
  data: any[]
}

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`search...`}
    />
  )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = (val) => !val

interface PaginationControlsProps {
  gotoPage: (page: number) => void
  previousPage: () => void
  nextPage: () => void
  canPreviousPage: boolean
  canNextPage: boolean
  pageCount: number
  pageIndex: number
  pageOptions: number[]
  pageSize: number
  setPageSize: (size: number) => void
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  gotoPage,
  previousPage,
  nextPage,
  canPreviousPage,
  canNextPage,
  pageCount,
  pageIndex,
  pageOptions,
  pageSize,
  setPageSize,
}) => (
  <div className="pagination-controls">
    <section className="paging-section">
      <div className="paging-buttons">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
      </div>
      <div className="page-display">
        <strong>
          {pageIndex + 1} / {pageOptions.length}
        </strong>{" "}
      </div>
    </section>
    <div className="page-size-setter">
      page size:{" "}
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value))
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  </div>
)

const ItemsTable: React.FC<ItemsTableProps> = ({ columns, data }) => {
  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
    }),
    [],
  )

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
      enableColumnResizing: true,
    },
    useFilters,
    useSortBy,
    usePagination,
  )

  return (
    <section className="items-table-outer-shell">
      <table style={{ fontSize: "11px", width: "90%" }} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={i}
            >
              {headerGroup.headers
                .filter((h) => !!h)
                .map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    <div className="header-title">
                      {column.render("Header")}
                      <span className="header-filter-icon">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <PiCaretUpBold size={8} />
                          ) : (
                            <PiCaretDownBold size={8} />
                          )
                        ) : (
                          <MdOutlineSort size={8} />
                        )}
                      </span>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr id="items-row" {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    id="items-cell"
                    {...cell.getCellProps()}
                    key={cell.column.id + cell.row.id}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      {data.length > 20 && (
        <PaginationControls
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
    </section>
  )
}

export default ItemsTable
