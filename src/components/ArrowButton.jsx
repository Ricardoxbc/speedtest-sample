import PropTypes from "prop-types";

function ArrowButton({ children, callback, adding }) {
  return <button onClick={() => callback(adding)}>{children}</button>;
}

ArrowButton.propTypes = {
  callback: PropTypes.func,
  children: PropTypes.any,
  adding: PropTypes.bool,
};

export default ArrowButton;
