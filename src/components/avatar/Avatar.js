import { useState, useEffect } from 'react'

const getInitials = (displayName = '') => {
  const [first = '', last = ''] = displayName.trim().split(/\s+/)
  return `${first[0] || ''}${last[0] || ''}`.toUpperCase()
}

const Avatar = ({ src, displayName, className = '', alt = 'profile' }) => {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className={`avatar-monogram ${className}`}>
        {getInitials(displayName)}
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
}

export default Avatar
