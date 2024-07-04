import { PartnerInfo } from "@/utils/models";
import { ChangeEventHandler, useState } from "react";

export interface Church {
  pic: string;
  name?: string;
};

interface ChurchSelectProps {
  value: Church | null;
  onChange: (partner: PartnerInfo) => void;
}

export function ChurchSelect(props: ChurchSelectProps) {
  const { value, onChange } = props;
  const [ search, setSearch ] = useState('');
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  }
  return <input type='text' value={search} onChange={handleChange}></input>
}