import { Switch } from "@mui/material";
import { FilterState } from "../../utils/types";
import classnames from 'classnames';

interface FilterStateInputProps {
  filterStateData: FilterState;
  onValueChange: (id: string, value: number) => void;
  onAppliedChange: (id: string) => void;
}

const FilterStateInput: React.FC<FilterStateInputProps> = ({ filterStateData, onValueChange, onAppliedChange }) => {
  const {id, label, value, applied} = filterStateData;
  return (
    <div className="input-wrapper">
      <label htmlFor={id}>{label}</label>
      <input
        className="text-input"
        id={id}
        type="number"
        value={value}
        onChange={(e) => onValueChange(id, Number(e.target.value))}
        placeholder={label}
      />
      <Switch checked={applied} onChange={() => onAppliedChange(id)} className={classnames(applied && 'on')}/>
    </div>
  );
};

export default FilterStateInput;