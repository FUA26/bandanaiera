import {forwardRef, ReactElement} from "react";
import {Loader2} from "lucide-react";

import {Button} from "../ui/button";

type MainButtonProps = {
  text: string;
  form?: string;
  isLoading?: boolean;
  action?: () => void;
  isSubmitable?: boolean;
  disabled?: boolean;
  width?: "full_width" | "contain" | string;
  dataLoadingText?: string;
  variant?: "primary" | "secondary";
  className?: string;
  iconRoute?: string;
  rightIconRoute?: string;
  rightIconClass?: string;
  iconComponent?: ReactElement;
  size?: "small" | "normal" | "large";
};

// eslint-disable-next-line no-undef
const MainButton = forwardRef<HTMLButtonElement, MainButtonProps>(
  (
    {
      text,
      isLoading = false,
      form,
      action,
      disabled = false,
      isSubmitable,
      width,
      dataLoadingText = "Please wait ...",
      variant = "primary",
      className,
      iconRoute,
      rightIconRoute,
      rightIconClass = "w-[24px] h-[24px]",
      iconComponent,
      size = "normal",
    },
    ref,
  ) => {
    const propWidth =
      width === "full_width" ? "w-full" : width ? (width === "contain" ? "" : "w-[245px]") : "";

    const isSecondaryVariant = variant !== "primary";

    const size_height =
      size === "normal" ? "h-[3.1215rem]" : size === "large" ? "h-[3.75rem]" : "h-[2.625rem]";

    const variant_hover = variant === "primary" ? "hover:bg-primary" : "hover:bg-secondary";

    return !isLoading ? (
      <Button
        ref={ref}
        className={`border-[.2rem] border-[#555E67] ${
          isSecondaryVariant ? "bg-secondary text-white" : "bg-primary"
        } text-white ${propWidth} md:${propWidth} select-none rounded-[1.3rem] hover:opacity-90 ${variant_hover} ${size_height} ${className}`}
        disabled={disabled}
        form={form}
        type={isSubmitable ? "submit" : "button"}
        onClick={!disabled ? action : () => undefined}
      >
        {iconRoute && <img alt="left button icon" className="size-[24px]" src={iconRoute} />}
        {iconRoute && <span>&nbsp;</span>}
        {iconComponent}
        {iconComponent && <span>&nbsp;</span>}
        {text}
        {rightIconRoute && <span>&nbsp;</span>}
        {rightIconRoute && (
          <img alt="right button icon" className={rightIconClass} src={rightIconRoute} />
        )}
      </Button>
    ) : (
      <Button
        ref={ref}
        disabled
        className={`bg-primary text-white ${propWidth} md:${propWidth} cursor-not-allowed select-none rounded-[0.625rem] ${size_height} ${
          className ? className : ""
        }`}
      >
        <Loader2 className="mr-2 size-4 animate-spin" />
        {dataLoadingText}
      </Button>
    );
  },
);

// Assigned display name
MainButton.displayName = "MainButton";

export default MainButton;
