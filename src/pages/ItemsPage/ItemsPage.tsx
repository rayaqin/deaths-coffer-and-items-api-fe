import "./ItemsPage.scss"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"
import { useItemsQuery, useItemsDummyQuery } from "../../utils/hooks"
import { useMemo, useState } from "react"
import ItemsTable from "../../components/ItemsTable/ItemsTable"
import { GrDocumentMissing } from "react-icons/gr";

const ImageCell: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState(src)
  const [error, setError] = useState(false)

  const handleError = () => {
    console.log("hello")
    setError(true)
    setImgSrc("path/to/your/fallback/image.png") // replace with your fallback image path
  }

  if(error) {
    return <GrDocumentMissing />
  }

  return (
    <>
      {!loaded && <div>Loading...</div>}
      <img
        src={imgSrc}
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
      const formattedDate = `${date.getFullYear()}.${
        date.getMonth() + 1
      }.${date.getDate()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      return <span>{formattedDate}</span>
    }
    return <span>{value}</span>
  }

  const selectHowToRenderCell = (header: string) => (props: CellValueProps) => {
    return getCellRender(header, props.cell.value)
  }

  const columns = useMemo(() => {
    if (data && data.items.length > 0) {
      return Object.keys(data.items[0]).map((key) => ({
        Header: (key.charAt(0).toUpperCase() + key.slice(1)).replace("GrandExchange", "GE").replace("RuneLite", "RL"),
        accessor: key,
        Cell: selectHowToRenderCell(key),
        filter: 'fuzzyText',
      }))
    }
    return []
  }, [data])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="items-page-outer-shell">
      {data && data.items.length > 0 ? (
        <ItemsTable columns={columns} data={data.items} />
      ) : (
        <p>No items found.</p>
      )}
    </div>
  )
}

export default ItemsPage
