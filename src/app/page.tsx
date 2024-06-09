import { getLinks } from "@/utils/links";
import { App } from "@/components/App";
import './style.css';
import common from '@/utils/common';

import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel.
const devMode = process.env.NODE_ENV === "development";
const mixpanelKey = devMode ? (
  process.env.NEXT_PUBLIC_MIXPANEL_key_dev
) : (
  process.env.NEXT_PUBLIC_MIXPANEL_key_prod
)
if (!mixpanelKey) throw new Error("Mixpanel key is not defined.");
mixpanel.init(mixpanelKey);

// let pic = common.getQueryVariable("p");
// fetch('api/links' + (pic ? "?p=" + pic : ''))
//   .then(r => r.json())
//   .then(links => {
//     ReactDOM.render(
//       <React.StrictMode>
//         <App links={links} pic={pic} mixpanel={mixpanel}/>
//       </React.StrictMode>,
//       document.getElementById('root')
//     );
//   });

interface Props {
  params?: {
    p?: string
  }
};

export default async function Home(props: Props) {
  const pic = props.params?.p || null;
  const links = getLinks(pic);
  return (
    <App data={{mixpanel}} />
  );
}