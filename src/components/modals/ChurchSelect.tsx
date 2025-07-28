import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Input } from "../Styles";
import { PartnerInfo, PartnerInfoSchema } from "@/models/partners";
import { z } from "zod/v4";

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
      <label htmlFor="church-select" className="block">
        <Input
          id="church-select"
          type="text"
          placeholder="Enter church name"
          value={search}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            // If it was an option click, don't hide the options.
            // Doing so would sometimes prevent the option's click from registering!
            if (e.relatedTarget !== null && e.relatedTarget.getAttribute("data-church-option") === "true") {
              return;
            }
            setFocused(false)
          }}
          onChange={handleChange}
        />
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
                  data-church-option
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
      </label>
    </>
  );
}

function useChurchSearch(query: string) {
  // Get all churches.
  const [allChurches, setAllChurches] = useState<PartnerInfo[] | null>([]);
  useEffect(() => {
    async function getChurches() {
      const resp = await fetchChurches();
      if (resp instanceof Error) {
        console.error("Failed to fetch churches:", resp);
        return;
      }
      setAllChurches(resp);
    }
    getChurches();
  }, []);

  const cleanQuery = query.replaceAll(/[^\w]/g, "").toLowerCase();

  const results = useMemo<PartnerInfo[]>(() => {
    // Concatinate name and pic, replacing all non-alphanumeric characters.
    const res = (allChurches || [])
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
  }, [cleanQuery, allChurches]);

  return results;
}

async function fetchChurches(): Promise<PartnerInfo[] | Error> {
  const resp = await fetch("/api/partners");
  if (!resp.ok) return new Error("Network error while fetching churches");
  const data = await resp.json();
  const parsed = z.array(PartnerInfoSchema).safeParse(data);
  if (!parsed.success) return new Error("Invalid church data");
  return parsed.data;
}