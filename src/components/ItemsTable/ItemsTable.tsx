import { useTable, usePagination, useSortBy, useFilters } from "react-table"
import { useMemo } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import { PiCaretUpBold } from "react-icons/pi"
import { MdOutlineSort } from "react-icons/md"
import "./ItemsTable.scss"

interface ItemsTableProps {
  columns: any[]
  filterTypes: any
  data: any[]
}

export function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
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

export function PriceRangeFilter({ column: { filterValue = {}, setFilter } }) {
  const { biggerThan, smallerThan } = filterValue
  return (
    <div
      style={{
        display: "flex",
        gap: "0.8rem",
        paddingRight: "0.6rem",
        maxWidth: "160px",
      }}
    >
      <input
        value={biggerThan || ""}
        onChange={(e) => {
          const val = e.target.value
          setFilter((old) => ({ ...old, biggerThan: val || undefined }))
        }}
        placeholder={`from`}
      />
      <input
        value={smallerThan || ""}
        onChange={(e) => {
          const val = e.target.value
          setFilter((old) => ({ ...old, smallerThan: val || undefined }))
        }}
        placeholder={`to`}
      />
    </div>
  )
}

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
          const newSize = Number(e.target.value)
          setPageSize(newSize)
          localStorage.setItem("pageSize", newSize.toString())
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

const ItemsTable: React.FC<ItemsTableProps> = ({
  columns,
  filterTypes,
  data,
}) => {
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const storedPageSize = Number(localStorage.getItem("pageSize"))
  const initialPageSize = storedPageSize ?? 20

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
      filterTypes,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: initialPageSize },
      enableColumnResizing: true,
    },
    useFilters,
    useSortBy,
    usePagination,
  )

  const formatter = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  const grandExchangeLastUpdate =
    data && formatter.format(new Date(data[0]["lastGrandExchangeUpdate"]))
  const runeLiteLastUpdate =
    data && formatter.format(new Date(data[0]["lastRuneLiteUpdate"]))

  return (
    <section className="items-table-outer-shell">
      <div className="last-update-wrapper">
        <section className="last-update-display">
          <div className="grid-cell">Last Grand Exchange update:</div>
          <div className="grid-cell">
            {data.length > 0 ? grandExchangeLastUpdate : "-"}
          </div>
          <div className="grid-cell">Last Rune Lite update:</div>
          <div className="grid-cell">
            {data.length > 0 ? runeLiteLastUpdate : "-"}
          </div>
        </section>
      </div>
      <table style={{ fontSize: "0.9rem", width: "94%" }} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers
                .filter((h) => !!h)
                .map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    <div className="header-title" style={{}}>
                      {column.render("Header")}
                      <span className="header-filter-icon">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <PiCaretUpBold size={12} />
                          ) : (
                            <PiCaretDownBold size={12} />
                          )
                        ) : (
                          <MdOutlineSort size={12} />
                        )}
                      </span>
                    </div>
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{ minHeight: "19.02px" }}
                    >
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
              <tr className="items-row" {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    className="items-cell"
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
