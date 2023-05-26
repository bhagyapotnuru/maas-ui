import classes from "../../composedNode.module.scss";

const PageInformation = (): JSX.Element => {
  return (
    <div className={classes.page_info_content}>
      <h4>Compose a System for your workload.</h4>
      <p>
        Our composition service lets you compose a computer system according to
        your need. To start with the composition process, you need a compute,
        please select a compute.
      </p>
    </div>
  );
};

export default PageInformation;
