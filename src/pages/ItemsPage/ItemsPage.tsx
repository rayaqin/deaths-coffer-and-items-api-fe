import "./ItemsPage.scss"
import { useTheme } from "../../utils/ThemeContext"
import { useItemsQuery } from "../../utils/hooks"
//import { useItemsDummyQuery } from "../../utils/hooks"
import { useMemo, useState } from "react"
import ItemsTable, {
  DefaultColumnFilter,
  PriceRangeFilter,
} from "../../components/ItemsTable/ItemsTable"
import { GrDocumentMissing } from "react-icons/gr"
import { Triangle } from "react-loader-spinner"
import { GiOpenChest } from "react-icons/gi"
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
      {!loaded && (
        <Triangle
          visible={true}
          height="20.57"
          width="20.57"
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

const ItemsPage: React.FC = () => {
  const { theme } = useTheme()

  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  const { data, error, isLoading } = useItemsQuery(apiURL + "items")
  //const { data, error, isLoading } = useItemsDummyQuery(apiURL + "items")

  type CellValueProps = { cell: { value: string } }

  const CellContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="cell-container">
      {children}
    </div>
  );


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

  const itemNameToIconPathMap = useMemo(() => {
    if (data && data.items.length > 0) {
      return data.items.reduce<{ [key: string]: string }>((acc, item) => {
        acc[item.name] = item.iconPath;
        return acc;
      }, {});
    }
    return {};
  }, [data]);

  const getCellRender = (header: string, value: string) => {
    return (
      <CellContainer>
        {header === "name" && <ImageCell src={itemNameToIconPathMap[value]} alt="-" />}
        <span className="cell-value">{value}</span>
      </CellContainer>
    );
  };

  const selectHowToRenderCell = (header: string) => (props: CellValueProps) => {
    return getCellRender(header, props.cell.value)
  }

  const columns = useMemo(() => {
    if (data && data.items.length > 0) {
      return Object.keys(data.items[0])
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
  }, [data])

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
  if (error)
    return (
      <div className="items-page-outer-shell loading">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <GiOpenChest size={56} style={{ margin: "2rem" }} />
          <span>The api did not return meaningful results</span>
          <span>
            I think you should write an angry letter to the maintainer
          </span>
        </div>
      </div>
    )

  return (
    <div className="items-page-outer-shell">
      {data && data.items.length > 0 ? (
        <ItemsTable
          columns={columns}
          data={data.items}
          filterTypes={filterTypes}
        />
      ) : (
        <p>No items found.</p>
      )}
    </div>
  )
}

export default ItemsPage
