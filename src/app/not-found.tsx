import { ErrorPage } from '../components/ErrorPage';

 
export default function NotFound() {
  return (
    <ErrorPage data={{message: `We couldn't find the page you are looking for.`}} />
  );
}

