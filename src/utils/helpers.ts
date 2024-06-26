import { DeathsCofferRequestBody, CombinedFilterState, FilterState } from "./types"

export const defaultFilterStates: CombinedFilterState = {
  minimumOfferingValue: {
    id: "minimumOfferingValue",
    label: "Min. Offering Value",
    applied: true,
    value: 0,
  },
  maximumPrice: {
    id: "maximumPrice",
    label: "Max. Price",
    applied: true,
    value: 0,
  },
  minimumTradeVolume: {
    id: "minimumTradeVolume",
    label: "Min. Trade Volume",
    applied: true,
    value: 0,
  },
}

export const getFiltersToApply = (combinedFilterState: CombinedFilterState): DeathsCofferRequestBody =>
  Object.values(combinedFilterState)
    .filter((filterState) => filterState.applied && filterState.value > 0)
    .reduce<DeathsCofferRequestBody>((acc, currentFilterState) => {
      acc[currentFilterState.id as keyof DeathsCofferRequestBody] = currentFilterState.value;
      return acc;
    }, {} as DeathsCofferRequestBody);
