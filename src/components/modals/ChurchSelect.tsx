import { PartnerInfo } from "@/models/models";
import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Input } from "../Styles";

interface ChurchSelectProps {
  // Value is ignored, because the component disappears when a church is selected.
  value: string | null;
  onChange: (value: string) => void;
}

export function ChurchSelect(props: ChurchSelectProps) {
  const { onChange } = props;
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const results = useChurchSearch(search);

  return (
    <>
      <div>
        <Input
          id="church-select"
          type="text"
          placeholder="Enter church name"
          value={search}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
          onChange={handleChange}
        ></Input>
        {focused && results && results.length > 0 ? (
          <div className="border-2 border-t-0 border-sfs-accent max-h-40 overflow-y-auto">
            {results.map(({ pic, name, url }) => {
              const onClick: MouseEventHandler<HTMLButtonElement> = (e) => {
                setSearch(name);
                onChange(pic);
                setFocused(false);
                e.stopPropagation();
              };
              // Remove any 'http(s)://' or 'www.' or any trailing '/'
              let dispUrl = url.replaceAll(/https?:\/\/|www\.|\/$/g, "");
              if (dispUrl.length > 30)
                dispUrl = dispUrl.substring(0, 37) + "...";
              return (
                <button
                  key={pic}
                  className="px-2 py-1 block w-full text-left hover:bg-sfs-accent text-black hover:text-white"
                  onClick={onClick}
                >
                  {name}
                  <span className="opacity-30 ms-2 widget:hidden">
                    {dispUrl}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}

function useChurchSearch(query: string) {
  // Get all churches.
  const [churches, setChurches] = useState<PartnerInfo[] | null>([]);
  useEffect(() => {
    async function getChurches() {
      const resp = await fetch("/api/partners");
      if (!resp.ok) {
        setChurches(null);
        return;
      }
      const data = await resp.json();
      setChurches(validateChurches(data));
    }
    getChurches();
  }, []);

  const cleanQuery = query.replaceAll(/[^\w]/g, "").toLowerCase();

  const results = useMemo<PartnerInfo[]>(() => {
    // Concatinate name and pic, replacing all non-alphanumeric characters.
    const res = (churches || [])
      .map((church) => ({
        church,
        key: (church.name + church.pic + church.url)
          .replaceAll(/[^\w]/g, "")
          .toLowerCase(),
      }))
      // Filter by keys which contain the clean query.
      .filter(({ key }) => key.search(cleanQuery) !== -1)
      // Discard the key when done, leaving just a list of churches.
      .map(({ church }) => church);
    res.push({ pic: "other", name: `Don't see your chuch?`, url: "" });
    return res;
  }, [cleanQuery, churches]);

  return results;
}

function validateChurches(arr: any): PartnerInfo[] | null {
  if (!Array.isArray(arr)) return null;
  const churches: PartnerInfo[] = [];
  for (let el of arr) {
    if (typeof el !== "object") return null;
    const { pic, name, url } = el;
    if (typeof pic !== "string") return null;
    if (name !== undefined && typeof name !== "string") return null;
    churches.push({ pic, name, url });
  }
  return churches;
}
