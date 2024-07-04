import arrow from '@/resources/ui/arrow.svg';
import Image from 'next/image';

interface ArrowProps {
  className?: string;
}

export function Arrow(props: ArrowProps) {
  const { className } = props;
  return <Image priority className={'h-[1em] w-[1em] ' + className} src={arrow} alt='->' />;
}
