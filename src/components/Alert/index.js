import React, { useState, useEffect } from 'react';

const Alert = (props) => {
  const [error, setError] = useState({
      type: '',
      message: '',
  })

  useEffect(() => {
    setError({
      type: props.error.type,
      message: props.error.message,
    })
  }, [props.error])

  return (
    <div>
      {error.type && (
        <div className={`alert ${error.type} alert-dismissible fade-show`}>
          {error.message}
          <button
            type="button"
            className="close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={() => {
              setError({
                type: '',
                message: '',
              })
            }}
            >
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
      )}
    </div>
  )
}

export default Alert
