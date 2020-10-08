import React from 'react'
import './Disclaimer.scss'

export default function Disclaimer(props) {

  const disclaimerSubject = isSubject => {
    switch (isSubject) {
      case 'warning':
        return 'disclaimer--warning'
      case 'error':
        return 'disclaimer--error'
      case 'success':
        return 'disclaimer--succes'
      default:
        return 'disclaimer--warning'
    }
  }

  const getSubject = disclaimerSubject(
    props.isSubject ? props.isSubject : 'disclaimer--warning'
  )

  return (
    <div className={`disclaimer__wrapper ${getSubject}`}>
      {props.children}
    </div>
  )
}
