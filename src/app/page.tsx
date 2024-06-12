import { getContent } from '@/utils/sheets';
import { App } from "@/components/App";
import common from '@/utils/common';

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
  searchParams?: {
    p?: string
  }
};

const errorScreen = (
  <div className='h-full text-center flex flex-col justify-center'>
    <div>
      We're having trouble right now. Please try again later.<br/>
      For now, you can check out <a className='underline' href='https://songsforsaplings.com'>our website</a> to find resources.
    </div>
  </div>
);

export default async function(props: Props) {
  const pic = props.searchParams?.p || null;
  const content = await getContent(pic);
  if (!content) return errorScreen;
  return (
    <App data={{content}} />
  );
}