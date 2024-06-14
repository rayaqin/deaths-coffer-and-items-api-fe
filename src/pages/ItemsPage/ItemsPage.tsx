import "./ItemsPage.scss"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"
import { useItemsQuery, useItemsDummyQuery } from "../../utils/hooks"
import { useMemo, useState } from "react"
import ItemsTable, { DefaultColumnFilter, PriceRangeFilter } from "../../components/ItemsTable/ItemsTable"
import { GrDocumentMissing } from "react-icons/gr"
import { Triangle } from "react-loader-spinner"
import { matchSorter } from "match-sorter"

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
      {!loaded && <Triangle
          visible={true}
          height="20.57"
          width="20.57"
          color="rgb(130, 180, 255)"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />}
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

const ItemsPage: React.FC = () => {
  const { theme } = useTheme()

  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  const { data, error, isLoading } = useItemsDummyQuery(apiURL + "items")

  type CellValueProps = { cell: { value: string } }

  const getCellRender = (header: string, value: string) => {
    if (header === "iconPath") {
      return <ImageCell src={value} alt="-" />
    }
    if (header.includes("date")) {
      const date = new Date(value)
      const formatter = new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      const formattedDate = formatter.format(date)
      return <span>{formattedDate}</span>
    }
    return <span>{value}</span>
  }

  const selectHowToRenderCell = (header: string) => (props: CellValueProps) => {
    return getCellRender(header, props.cell.value)
  }

  const rangeFilterFn = (rows, id, filterValue) => {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      if (filterValue.biggerThan && rowValue <= filterValue.biggerThan) {
        return false;
      }
      if (filterValue.smallerThan && rowValue >= filterValue.smallerThan) {
        return false;
      }
      return true;
    });
  };

  const columns = useMemo(() => {
    if (data && data.items.length > 0) {
      return Object.keys(data.items[0]).filter(c=>!c.includes("RuneLite")).map((key) => ({
        Header: (key.charAt(0).toUpperCase() + key.slice(1))
          .replace("GrandExchange", ""),
        accessor: key,
        Cell: selectHowToRenderCell(key),
        Filter: key.includes("rice") ? PriceRangeFilter : DefaultColumnFilter, // assuming you have this defined somewhere
      filter: key.includes("rice") ? 'priceRange' : 'fuzzyText',
      }))
    }
    return []
  }, [data])

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
  }
  
  fuzzyTextFilterFn.autoRemove = (val) => !val

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn, // assuming you have this defined somewhere
      priceRange: rangeFilterFn,
    }),
    []
  );

  if (isLoading)
    return (
      <div className="items-page-outer-shell loading">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="rgb(96, 122, 182)"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    )
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="items-page-outer-shell">
      {data && data.items.length > 0 ? (
        <ItemsTable columns={columns} data={data.items} filterTypes={filterTypes} />
      ) : (
        <p>No items found.</p>
      )}
    </div>
  )
}

export default ItemsPage
