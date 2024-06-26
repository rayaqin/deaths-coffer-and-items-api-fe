import React, { useState } from "react"
import { appendThemeClass, useTheme } from "../../utils/ThemeContext"
import "./CalculatorPage.scss"
import ItemsTable from "../../components/ItemsTable/ItemsTable"
import { Triangle } from "react-loader-spinner"
import { GiOpenChest } from "react-icons/gi"
import { CalculateDeathsCofferQueryResponse, CombinedFilterState, FilterState } from "../../utils/types"
import { checkIfRequestBodyIsAllZeros, useCalculateDeathsCofferQuery } from "../../utils/hooks"
import Switch from '@mui/material/Switch';
import { defaultFilterStates, getFiltersToApply } from "../../utils/helpers"
import FilterStateInput from "../../components/FilterStateInput/FilterStateInput"
//import { useCalculateDeathsCofferQueryDummy } from "../../utils/hooks"

const CalculatorPage: React.FC = () => {
  const { theme } = useTheme()

  const [combinedFilterState, setCombinedFilterState] = useState<CombinedFilterState>(defaultFilterStates)

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
    
    const body = getFiltersToApply(combinedFilterState);

    refetch(body)
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  const updateFilterStateValue = (id: string, value: number) => {
    setCombinedFilterState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        value,
      },
    }));
  }

  const updateFilterStateApplied = (id: string) => {
    setCombinedFilterState(prevState => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        applied: !prevState[id].applied,
      },
    }));
  }

  return (
    <div className={`calculator-page-outer-shell ${appendThemeClass(theme)}`}>
      <div className="inner-shell">
        <fieldset onKeyUp={handleKeyUp}>
          {Object.keys(combinedFilterState).map((key) => (
            <FilterStateInput
              key={key}
              filterStateData={combinedFilterState[key]}
              onValueChange={updateFilterStateValue}
              onAppliedChange={updateFilterStateApplied}
            />
          ))}
          <button style={{ marginBottom: "30px" }} onClick={handleCalculate}>
            Calculate
          </button>
        </fieldset>
        <div className="calculated-items">
          <CalculatorPageContent
            isLoading={isLoading}
            error={error}
            data={data}
          />
        </div>
      </div>
    </div>
  )
}

interface CalculatorPageContentProps {
  isLoading: boolean;
  error: Error | null;
  data?: CalculateDeathsCofferQueryResponse | null;
}

function CalculatorPageContent({ isLoading, error, data = null }: CalculatorPageContentProps) {
  if (!isLoading && !error && !data) {
    return <GiOpenChest size={112} style={{ marginTop: "4rem" }} />
  }

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {"Well, fetching the calculated items failed somehow, and we all know it's the fault of the backend devs. I'd suggest writing about your frustration to the maintainer, and attaching a threatening gif to the e-mail."}
      </div>
    );
  }

  if (!data!.bestOfferings?.length) {
    return <p>No items found with the provided parameters</p>;
  }

  return (
    <ItemsTable
      items={data!.bestOfferings || []}
    />
  );
}

export default CalculatorPage
