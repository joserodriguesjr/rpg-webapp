import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableRowNumberInputWithButtonsProps } from './types';

const TableRowNumberInputWithButtons: React.FC<
  TableRowNumberInputWithButtonsProps
> = ({ placeholder, defaultValue, register, setter, getter, varName }) => {
  return (
    <TableRow className="flex flex-row">
      <TableCell>
        <Button
          onClick={() => setter(varName, parseInt(getter()[varName]) - 1)}
        >
          {' '}
          -{' '}
        </Button>
      </TableCell>
      <TableCell className="flex-grow">
        <Input
          placeholder={placeholder}
          defaultValue={defaultValue}
          type="number"
          {...register(varName)}
        />
      </TableCell>
      <TableCell>
        <Button
          onClick={() => setter(varName, parseInt(getter()[varName]) + 1)}
        >
          {' '}
          +{' '}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default TableRowNumberInputWithButtons;
