import React from 'react'

const HeaderInfo = () => {
  return (
    <div className="bg-blue-100 border border-blue-500 rounded text-blue-700 text-sm px-4 py-3 mb-4 space-y-4">
      <p className="leading-normal">
        该功能仅 Surge iOS 4.4.0 和 Surge Mac 4.0.0 以上版本支持。
      </p>
      <p className="leading-normal">
        <a
          href="https://manual.nssurge.com/others/http-api.html#configuration"
          target="_blank"
          rel="noreferrer"
          className="border-b border-solid border-blue-500"
        >
          🔗 开启方式
        </a>
      </p>
    </div>
  )
}

export default HeaderInfo
