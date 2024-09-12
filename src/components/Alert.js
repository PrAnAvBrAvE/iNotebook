import React from 'react'

function Alert(props) {
    
    const capitalize = (word) => {
        if(word==="danger"){
          word = "error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

  return (
    // The && operator is used for conditional rendering in React. This expression means "if props.alert is truthy, 
    // then render the following JSX."
    // If props.alert is null, undefined, or false, the expression will short-circuit, and nothing will be rendered.
    <div style={{height: '40px'}}>
    {props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
        <strong>{capitalize(props.alert.type)}</strong> : {props.alert.message}
    </div>}
    </div>
  )
}

export default Alert