import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import type { TooltipProps } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

type Props = {
  title?: any;
  children: any;
  style?: any;
  className?: any;
  placement?: any;
};

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    maxWidth: 220,
  },
}));

const CustomizedTooltip = ({
  title,
  children,
  style,
  placement = "bottom",
  ...props
}: Props): JSX.Element => {
  return (
    <div style={style} {...props}>
      <BootstrapTooltip placement={placement} title={title}>
        {children}
      </BootstrapTooltip>
    </div>
  );
};

export default CustomizedTooltip;
