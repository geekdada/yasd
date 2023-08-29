import React, { useMemo, useState } from 'react'
import { Collapse } from 'react-collapse'
import { useTranslation } from 'react-i18next'
import { css } from '@emotion/react'
import { ChevronRight } from '@sumup/icons'
import bytes from 'bytes'
import tw from 'twin.macro'

import { DataRow, DataRowMain, DataRowSub } from '@/components/Data'
import { ConnectorTraffic } from '@/types'

interface TrafficDataRowProps {
  name: string
  data: ConnectorTraffic
}

const TrafficDataRow: React.FC<TrafficDataRowProps> = ({ name, data }) => {
  const { t } = useTranslation()
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const tcpStat = useMemo(() => {
    if (!data.statistics || !data.statistics.length) return

    let total = 0

    data.statistics.forEach((stat) => {
      total += stat.srtt
    })

    return Math.round(total / data.statistics.length)
  }, [data.statistics])

  return (
    <DataRow
      css={css`
        ${tw`cursor-pointer`}
        .ReactCollapse--collapse {
          ${tw`transition-all duration-200 ease-in-out`}
        }
      `}
      key={name}
      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
    >
      <DataRowMain>
        <div className="truncate flex-1 text-sm md:text-base">{name}</div>
        <div className="flex items-center ml-3 text-sm md:text-base">
          <div>
            {t('traffic.total')} {bytes(data.in + data.out)}
          </div>
          <ChevronRight
            css={[
              tw`ml-2 -mr-1 w-5 h-5 transition-transform duration-200 ease-in-out`,
              isDetailsOpen && tw`transform rotate-90`,
            ]}
          />
        </div>
      </DataRowMain>

      <Collapse isOpened={isDetailsOpen}>
        <div className="pb-3">
          <DataRowSub>
            <div>{t('traffic.traffic')}</div>
            <div>
              <span>{`${t('traffic.upload')}: ${bytes(data.out)}`}</span>
              <span> </span>
              <span>{`${t('traffic.download')}: ${bytes(data.in)}`}</span>
            </div>
          </DataRowSub>
          <DataRowSub>
            <div>{t('traffic.current_speed')}</div>
            <div>
              <span>{`${t('traffic.upload')}: ${bytes(
                data.outCurrentSpeed,
              )}/s`}</span>
              <span> </span>
              <span>{`${t('traffic.download')}: ${bytes(
                data.inCurrentSpeed,
              )}/s`}</span>
            </div>
          </DataRowSub>
          <DataRowSub>
            <div>{t('traffic.maximum_speed')}</div>
            <div>
              <span>{`${t('traffic.upload')}: ${bytes(
                data.outMaxSpeed,
              )}/s`}</span>
              <span> </span>
              <span>{`${t('traffic.download')}: ${bytes(
                data.inMaxSpeed,
              )}/s`}</span>
            </div>
          </DataRowSub>
          {!!tcpStat && (
            <DataRowSub>
              <div>{t('traffic.tcp_summary')}</div>
              <div>{`${t('traffic.avg_rtt')} ${tcpStat}ms`}</div>
            </DataRowSub>
          )}
        </div>
      </Collapse>
    </DataRow>
  )
}

export default TrafficDataRow
