import './ItemsPage.scss'
import { appendThemeClass, useTheme } from '../../utils/ThemeContext'
import { useItemsQuery, useItemsDummyQuery } from '../../utils/hooks'
import { useMemo } from 'react'

const ItemsPage: React.FC = () => {

  const { theme } = useTheme()

  const apiURL: string = import.meta.env.VITE_DEATHS_COFFER_API_URL

  const { data, error, isLoading } = useItemsDummyQuery(apiURL + "items")


  const columns = useMemo(() => {
    if (data && data.items.length > 0) {
      return Object.keys(data.items[0]).map(key => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
      }));
    }
    return [];
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>

    </div>
  );
}

export default ItemsPage
