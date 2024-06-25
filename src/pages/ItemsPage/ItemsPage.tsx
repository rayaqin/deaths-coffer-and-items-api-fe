import "./ItemsPage.scss"
import { useItemsQuery } from "../../utils/hooks"
//import { useItemsQueryDummy } from "../../utils/hooks"
import { Triangle } from "react-loader-spinner"
import { GiOpenChest } from "react-icons/gi"
import ItemsTable from "../../components/ItemsTable/ItemsTable"


const ItemsPage: React.FC = () => {
  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  const { data, error, isLoading } = useItemsQuery(apiURL + "items")
  //const { data, error, isLoading } = useItemsQueryDummy(apiURL + "items")


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
        className="no-results-message"
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
          items={data.items}
        />
      ) : (
        <p>No items found.</p>
      )}
    </div>
  )
}

export default ItemsPage
