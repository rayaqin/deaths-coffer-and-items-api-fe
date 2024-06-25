import React, { useEffect, useState } from "react"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"
import "./CalculatorPage.scss"
import { useQuery } from "react-query"
import ItemsTable from "../../components/ItemsTable/ItemsTable"
import { Triangle } from "react-loader-spinner"
import { GiOpenChest } from "react-icons/gi"
import { DeathsCofferRequestBody } from "../../utils/types"
import { checkIfRequestBodyIsAllZeros, useCalculateDeathsCofferQuery } from "../../utils/hooks"
import { useCalculateDeathsCofferQueryDummy } from "../../utils/hooks"

const initialRequestBody = {
  minimumOfferingValue: 0,
  maximumPrice: 0,
  minimumTradeVolume: 0,
}

const CalculatorPage: React.FC = () => {
  const { theme } = useTheme()
  const [minimumOfferingValue, setMinimumOfferingValue] = useState<number>(0)
  const [maximumPrice, setMaximumPrice] = useState<number>(0)
  const [minimumTradeVolume, setMinimumTradeVolume] = useState<number>(0)

  /*const {
    data,
    isLoading,
    error,
    refetch,
  } = useCalculateDeathsCofferQueryDummy()*/

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useCalculateDeathsCofferQuery()

  const handleCalculate = async () => {
    
    const body = {
      minimumOfferingValue,
      maximumPrice,
      minimumTradeVolume,
    }
    if (!checkIfRequestBodyIsAllZeros(body)) {
      refetch(body)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <div className={`calculator-page-outer-shell ${appendThemeClass(theme)}`}>
      <div className="inner-shell">
        <fieldset onKeyUp={handleKeyUp}>
          <div className="input-wrapper">
            <label htmlFor="minimumOfferingValue">Min. Offering Value</label>
            <input
              id="minimumOfferingValue"
              type="number"
              value={minimumOfferingValue}
              onChange={(e) => setMinimumOfferingValue(Number(e.target.value))}
              placeholder="Minimum Offering Value"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="maximumPrice">Max. Price</label>
            <input
              id="maximumPrice"
              type="number"
              value={maximumPrice}
              onChange={(e) => setMaximumPrice(Number(e.target.value))}
              placeholder="Maximum Price"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="minimumTradeVolume">Min. Trade Volume</label>
            <input
              id="minimumTradeVolume"
              type="number"
              value={minimumTradeVolume}
              onChange={(e) => setMinimumTradeVolume(Number(e.target.value))}
              placeholder="Minimum Trade Volume"
            />
          </div>
          <button onClick={handleCalculate}>Calculate</button>
        </fieldset>
        <div className="calculated-items">
          {!isLoading && !error && !data && (
            <GiOpenChest size={112} style={{ marginTop: "4rem" }} />
          )}
          {isLoading ? (
            <div className="loading-triangle">
              <Triangle
                height="80"
                width="80"
                color="rgb(96, 122, 182)"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : error ? (
            
            <div className="error-message">{"Well, fetching the calculated items failed somehow, and we all know it's the fault of the backend devs. I'd suggest writing about your frustration to the maintainer, and attaching a threatening gif to the e-mail."}</div>
          ) : (
            data && <ItemsTable items={data} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CalculatorPage
