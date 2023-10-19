import PropTypes from "prop-types"
function ActionButton({children, callback}) {

    return (
        <span onClick={() => {callback()}}>
            {children}
        </span>
    )

}

ActionButton.propTypes = {
  callback: PropTypes.func,
  children: PropTypes.any
}

export default ActionButton
