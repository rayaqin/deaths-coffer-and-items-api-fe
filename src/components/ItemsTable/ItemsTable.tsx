// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useTable, usePagination, useSortBy, useFilters } from "react-table"
import { useMemo, useState } from "react"
import { PiCaretDownBold } from "react-icons/pi"
import { PiCaretUpBold } from "react-icons/pi"
import { MdOutlineSort } from "react-icons/md"
import { Triangle } from "react-loader-spinner"
import { GrDocumentMissing } from "react-icons/gr"
import "./ItemsTable.scss"
import { matchSorter } from "match-sorter"
import { Item } from "../../utils/types"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"

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

const ImageCell: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
  }

  if (error) {
    return <GrDocumentMissing size={16} />
  }

  return (
    <>
      {!loaded && (
        <Triangle
          visible={true}
          height="16"
          width="16"
          color="rgb(130, 180, 255)"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      )}
      <img
        src={src}
        height="19.65"
        width="19.65"
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{ display: loaded ? "block" : "none" }}
      />
    </>
  )
}


type CellValueProps = { cell: { value: string } }

const CellContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="cell-container">
    {children}
  </div>
);

const getCellRender = (header: string, value: string, itemNameToIconPathMap: Record<string, string>) => {
  return (
    <CellContainer>
      {header === "name" && <ImageCell src={itemNameToIconPathMap[value]} alt="-" />}
      <span className="cell-value">{value}</span>
    </CellContainer>
  );
};

const rangeFilterFn = (rows, id, filterValue) => {
  return rows.filter((row) => {
    const rowValue = row.values[id]
    if (filterValue.biggerThan && rowValue <= filterValue.biggerThan) {
      return false
    }
    if (filterValue.smallerThan && rowValue >= filterValue.smallerThan) {
      return false
    }
    return true
  })
}

const initialPageSize = Number(localStorage.getItem("pageSize") ?? 20)

interface ItemsTableProps {
  items: Item[]
}

const ItemsTable: React.FC<ItemsTableProps> = ({
  items,
}) => {
  const { theme } = useTheme()

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    [],
  )

  const itemNameToIconPathMap = useMemo(() => {
    if (items?.length > 0) {
      return items.reduce((acc, item) => {
        acc[item.name] = item.iconPath;
        return acc;
      }, {} as {[key: string] : string});
    }
    return {};
  }, [items]);


  const selectHowToRenderCell = (header: string) => (props: CellValueProps) => {
    return getCellRender(header, props.cell.value, itemNameToIconPathMap)
  }

  const columns = useMemo(() => {
    if (items?.length > 0) {
      return Object.keys(items[0])
        .filter((c) => !c.includes("Update") && !c.includes("iconPath"))
        .map((key) => ({
          Header: (key.charAt(0).toUpperCase() + key.slice(1)).replace(
            "GrandExchange",
            "G.E.",
          ),
          accessor: key,
          Cell: selectHowToRenderCell(key),
          Filter: key.includes("rice") ? PriceRangeFilter : DefaultColumnFilter,
          filter: key.includes("rice") ? "priceRange" : "fuzzyText",
        }))
    }
    return []
  }, [items])

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
  }

  fuzzyTextFilterFn.autoRemove = (val) => !val

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      priceRange: rangeFilterFn,
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
      data: items,
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
    items && formatter.format(new Date(items[0]["lastGrandExchangeUpdate"]))
  const runeLiteLastUpdate =
    items && formatter.format(new Date(items[0]["lastRuneLiteUpdate"]))

  return (
    <section className={appendThemeClass("items-table-outer-shell", theme)}>
      <div className="last-update-wrapper">
        <section className="last-update-display">
          <div className="grid-cell">Last Grand Exchange update:</div>
          <div className="grid-cell">
            {items?.length > 0 ? grandExchangeLastUpdate : "-"}
          </div>
          <div className="grid-cell">Last Rune Lite update:</div>
          <div className="grid-cell">
            {items?.length > 0 ? runeLiteLastUpdate : "-"}
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
      {items?.length && (
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
