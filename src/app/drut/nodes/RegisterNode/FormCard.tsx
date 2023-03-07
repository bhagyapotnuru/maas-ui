import type { ReactNode } from "react";

import { Card, Col, Row } from "@canonical/react-components";
import { COL_SIZES } from "app/base/constants";
import PropTypes from "prop-types";

type Props = {
  children: ReactNode;
  sidebar?: boolean;
  stacked?: boolean;
  title?: ReactNode;
};

const getContentSize = (sidebar: boolean, title: ReactNode) => {
  const { CARD_TITLE, SIDEBAR, TOTAL } = COL_SIZES;
  let contentSize = TOTAL;
  if (sidebar) {
    contentSize -= SIDEBAR;
  }
  if (title) {
    contentSize -= CARD_TITLE;
  }
  return contentSize;
};

export const FormCard = ({
  children,
  sidebar = true,
  stacked,
  title,
}: Props): JSX.Element => {
  // const { CARD_TITLE } = COL_SIZES;
  const contentSize: any = getContentSize(sidebar, title);
  const titleNode =
    typeof title === "string" ? (
      <h4 className="form-card__title">{title}</h4>
    ) : (
      title
    );
  const content = stacked ? (
    <>
      {titleNode}
      {children}
    </>
  ) : (
    <Row>
      {/*title && <Col size={CARD_TITLE}>{titleNode}</Col>*/}
      <Col size={1}></Col>
      <Col data-testid="content" size={contentSize}>
        {children}
      </Col>
    </Row>
  );
  return (
    <Card className="form-card" highlighted={true}>
      {content}
    </Card>
  );
};

FormCard.propTypes = {
  children: PropTypes.node.isRequired,
  sidebar: PropTypes.bool,
  stacked: PropTypes.bool,
  title: PropTypes.node,
};

export default FormCard;
