/** @jsx jsx */
import { jsx } from '@emotion/core'
import React, { useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled/macro'
import css from '@emotion/css/macro'
import tw from 'twin.macro'
import ReactGA from 'react-ga'
import axios from 'axios'
import dayjs from 'dayjs'

interface AdData {
  id: number
  name: string
  url: string
  image?: string
}

const Ad: React.FC = () => {
  const showDynamicAd = useRef('REACT_APP_SHOW_AD' in process.env)
  const [ad, setAd] = useState<AdData>()

  useEffect(() => {
    let isMounted = true

    if (showDynamicAd.current) {
      axios
        .get<{ list: Array<AdData> }>(
          'https://cdn.jsdelivr.net/gh/geekdada/ad-json/ad.json',
          {
            timeout: 3000,
          },
        )
        .then(({ data }) => {
          const { list } = data
          const adList = list.filter((item) => item.id === 20201013)

          if (adList.length) {
            isMounted && setAd(adList[0])
          } else {
            throw new Error('Target ad not found')
          }
        })
        .catch(() => {
          isMounted &&
            setAd({
              id: 1,
              name: '请我喝咖啡！',
              url: 'https://surgio.royli.dev/support.html',
            })
        })
    } else {
      isMounted &&
        setAd({
          id: 1,
          name: '请我喝咖啡！',
          url: 'https://surgio.royli.dev/support.html',
        })
    }

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <React.Fragment>
      {ad && (
        <ReactGA.OutboundLink
          eventLabel={`IndexAd_${ad.name}`}
          to={ad.url}
          target="_blank">
          <div tw="bg-blue-100 border border-blue-500 rounded text-blue-700 px-4 py-3 flex items-center">
            {showDynamicAd.current && (
              <span tw="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold text-white mr-3">
                AD
              </span>
            )}

            <span>{ad.name}</span>
          </div>
        </ReactGA.OutboundLink>
      )}
    </React.Fragment>
  )
}

export default Ad
