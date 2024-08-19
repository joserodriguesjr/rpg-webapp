import {
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';

export type Inputs = {
  healthCurrent: string;
  energyCurrent: string;
  healthDicesCurrent: string;
  inspiration: boolean;
};

export interface TableRowNumberInputWithButtonsProps {
  placeholder: string;
  defaultValue: number;
  register: UseFormRegister<Inputs>;
  setter: UseFormSetValue<Inputs>;
  getter: UseFormGetValues<Inputs>;
  varName:
    | 'healthCurrent'
    | 'energyCurrent'
    | 'healthDicesCurrent'
    | 'inspiration';
}
