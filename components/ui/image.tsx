import NextImage, {ImageProps as NextImageProps} from "next/image";
import clsx from "clsx";
import {useState} from "react";

interface ImageProps extends NextImageProps {
  enableTransition?: boolean;
  enableLoading?: boolean;
}

const Image = (props: ImageProps) => {
  const {
    alt,
    src,
    className,
    priority,
    enableTransition = true,
    enableLoading = true,
    ...rest
  } = props;
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={clsx("overflow-hidden", enableLoading && isLoading ? "animate-pulse" : "")}>
      <NextImage
        alt={alt}
        className={clsx(
          enableTransition ? "duration-700 ease-in-out" : "",
          enableTransition && isLoading
            ? "scale-[1.02] blur-xl grayscale"
            : enableTransition
              ? "scale-100 blur-0 grayscale-0"
              : "",
          className,
        )}
        loading={priority ? "eager" : "lazy"}
        quality={100}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        src={src}
        onLoad={() => setLoading(false)}
        {...rest}
      />
    </div>
  );
};

export default Image;
