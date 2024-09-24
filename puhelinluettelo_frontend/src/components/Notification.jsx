const Notification = ({ message, isError }) => {

    const baseStyle = {
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 6,
      marginBottom: 10
    }
  
    const successStyle = {
      ...baseStyle,
      color: 'green',
      borderColor: 'green'
    }
  
    const errorStyle = {
      ...baseStyle,
      color: 'red',
      borderColor: 'red'
    }
  
    if (message === null) {
      return null
    }
  
    return (
      <div style={!isError ? successStyle : errorStyle}>
        {message}
      </div>
    )
  }
  
export default Notification
  