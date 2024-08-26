import { useMediaQuery } from '@react-hook/media-query';

const useMediaQueryProvide = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)');
  return isMobile;
};

export default useMediaQueryProvide;
